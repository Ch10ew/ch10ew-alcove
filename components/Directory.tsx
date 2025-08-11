import { promises as fs } from "fs";
import { PAGES_DIR, PAGES_ROUTE } from "@/lib/constants";
import { getAllMDXFiles } from "@/lib/mdx-loader";
import path from "path";
import { getFallbackTitle } from "@/lib/mdx-utils";
import { compileMDX } from "next-mdx-remote/rsc";
import { slugifyFilePath } from "@/lib/slugify";
import { cn } from "@/lib/util";
import TransitionLink from "./TransitionLink";

export default async function Directory() {
  const root = path.join(process.cwd(), PAGES_DIR);
  const filepaths = await getAllMDXFiles(root);

  interface Frontmatter {
    title: string;
    weight: number;
  }

  const allPages = await Promise.all(
    filepaths.map(async (filepath) => {
      const content = await fs.readFile(filepath, "utf-8");

      const titleFromPath = getFallbackTitle(filepath);

      const { frontmatter } = await compileMDX<Partial<Frontmatter>>({
        source: content,
        options: {
          parseFrontmatter: true,
        },
      });

      const title = frontmatter?.title || titleFromPath;
      const weight = frontmatter?.weight ?? 1;

      const slug = slugifyFilePath(filepath, root);
      const relativePath = path.relative(root, filepath);

      const folder = path.dirname(relativePath).split(path.sep)[0] ?? "";

      return {
        title,
        weight,
        slug,
        folder: folder === "." ? "" : folder,
      };
    })
  );

  const grouped: Record<
    string,
    { title: string; slug: string; weight: number }[]
  > = {};

  for (const page of allPages) {
    if (!grouped[page.folder]) {
      grouped[page.folder] = [];
    }
    grouped[page.folder].push({
      title: page.title,
      slug: page.slug,
      weight: page.weight,
    });
  }

  const folderNames = Object.keys(grouped).sort();
  for (const folder of folderNames) {
    grouped[folder].sort((a, b) => a.weight - b.weight);
  }

  return (
    <ul>
      {folderNames.map((folder, key) => (
        <li key={key}>
          {folder && <h2 className="font-bold text-lg px-3">{folder}</h2>}
          <ul>
            {grouped[folder].map(({ title, slug }, key) => (
              <TransitionLink href={`${PAGES_ROUTE}${slug}`} key={key}>
                <li
                  className={cn(
                    "my-1 py-1 px-3 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors duration-300",
                    folder ? "pl-8" : ""
                  )}
                >
                  {title}
                </li>
              </TransitionLink>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
