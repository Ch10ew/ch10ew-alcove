import path from "path";

/**
 * Generates a fallback title from a given filepath.
 * E.g. "inner-sample.mdx" → "Inner Sample"
 */
export function getFallbackTitle(filepath: string): string {
  return path
    .basename(filepath, ".mdx")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
