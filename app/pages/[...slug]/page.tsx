import { promises as fs } from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { PAGES_DIR } from "@/lib/constants";
import { findFileBySlug, getAllMDXFiles } from "@/lib/mdx-loader";
import { slugifyFilePath } from "@/lib/slugify";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import { getFallbackTitle } from "@/lib/mdx-utils";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { Frontmatter } from "@/lib/types";
import { cn } from "@/lib/util";
import ImageDownsampler from "@/components/ImageDownsampler";

type Params = Promise<{ slug: string[] }>;

export async function generateStaticParams() {
  const root = path.join(process.cwd(), PAGES_DIR);
  const files = await getAllMDXFiles(root);

  return files.map((filepath) => {
    const slug = slugifyFilePath(filepath, root);
    return { slug: slug.split("/") };
  });
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;

  const filepath = await findFileBySlug(
    slug,
    path.join(process.cwd(), PAGES_DIR)
  );

  if (!filepath) {
    notFound();
  }

  const content = await fs.readFile(filepath, "utf-8");

  const { frontmatter } = await compileMDX<Partial<Frontmatter>>({
    source: content,
    options: {
      parseFrontmatter: true,
    },
  });

  const fallbackTitle = getFallbackTitle(filepath);

  return {
    title: frontmatter?.title || fallbackTitle,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const filepath = await findFileBySlug(
    slug,
    path.join(process.cwd(), PAGES_DIR)
  );

  if (!filepath) {
    notFound();
  }

  const content = await fs.readFile(filepath, "utf-8");

  const { content: compiledContent, frontmatter } =
    await compileMDX<Frontmatter>({
      source: content,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeUnwrapImages],
        },
      },
      components: {
        // Load components used by MDX pages here
        ImageDownsampler,
      },
    });

  const fallbackTitle = getFallbackTitle(filepath);

  const title = frontmatter?.title || fallbackTitle;

  const date =
    frontmatter?.date && !Number.isNaN(frontmatter?.date)
      ? new Date(frontmatter?.date)?.toLocaleDateString("en-ca")
      : null;

  return (
    <>
      <h1
        className={cn(
          "mx-auto max-w-3xl font-bold text-5xl",
          date ? "mb-4" : "mb-8"
        )}
      >
        {title}
      </h1>
      {date ? <p className="mx-auto max-w-3xl mb-4">{date}</p> : <></>}
      <hr className="mx-auto max-w-3xl mb-8 border-primary" />
      <article className="my-6 mx-auto max-w-3xl prose-matcha dark:prose-invert md:prose-lg lg:prose-xl">
        {compiledContent}
      </article>
    </>
  );
}
