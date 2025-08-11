import path from "path";

/**
 * Converts a file path like "Inside your head/inner-sample.mdx"
 * into a clean slug like "inside-your-head/inner-sample"
 */
export function slugifyFilePath(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath);
  const noExt = relativePath.replace(/\.mdx$/, "");
  const parts = noExt.split(path.sep);

  return parts
    .map(
      (part) =>
        part
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumerics with hyphen
          .replace(/^-+|-+$/g, "") // remove leading/trailing hyphens
    )
    .join("/");
}
