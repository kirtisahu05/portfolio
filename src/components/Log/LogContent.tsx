import Markdown from "@/components/Markdown";

export default function LogContent({ content }: { content: string }) {
  return (
    <Markdown
      content={content}
      className="log-content max-w-none text-[15px] leading-relaxed text-[var(--text-secondary)]"
    />
  );
}
