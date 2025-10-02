import { promises as fs } from "fs";
import path from "path";
import { slugifyFilePath } from "./slugify";

/**
 * Recursively gets all .mdx files from a given directory.
 */
export async function getAllMDXFiles(dir: string): Promise<string[]> {
  const directoryEntries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    directoryEntries.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getAllMDXFiles(res); // recurse into subdir
      } else if (res.endsWith(".mdx")) {
        return [res];
      } else {
        return [];
      }
    })
  );

  return files.flat();
}

/**
 * Gets a file given its slug
 */
export async function findFileBySlug(
  slugParts: string[],
  baseDir: string
): Promise<string | null> {
  const allFiles = await getAllMDXFiles(baseDir);
  const targetSlug = slugParts.join("/");

  for (const filepath of allFiles) {
    const currentSlug = slugifyFilePath(filepath, baseDir);
    if (currentSlug === targetSlug) return filepath;
  }

  return null;
}
