// Strips common Markdown syntax down to plain text for card/list previews,
// where a snippet needs to read as prose rather than showing raw "###" and
// "**" markers. Not a full parser — just enough for the syntax these sheets
// actually use (headings, bold/italic, inline code, links, list markers).
export function toPlainSnippet(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
