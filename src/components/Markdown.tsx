import ReactMarkdown, { type Components } from "react-markdown";

// react-markdown injects a `node` prop (the underlying hast node) into every
// custom component — spreading the rest of props onto a DOM element without
// stripping it first leaks a stray node="[object Object]" attribute into
// the rendered HTML.
function omitNode<T extends { node?: unknown }>(props: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude it from `rest`
  const { node, ...rest } = props;
  return rest;
}

const components: Components = {
  h1: (props) => (
    <h1
      className="mt-8 mb-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] first:mt-0"
      {...omitNode(props)}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-7 mb-3 font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)] first:mt-0"
      {...omitNode(props)}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 mb-2 font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)] first:mt-0"
      {...omitNode(props)}
    />
  ),
  p: (props) => <p className="my-4" {...omitNode(props)} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1.5 pl-6" {...omitNode(props)} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1.5 pl-6" {...omitNode(props)} />,
  a: (props) => (
    <a
      className="underline decoration-[var(--border-strong)] underline-offset-2 hover:text-[var(--text-primary)]"
      style={{ color: "var(--accent)" }}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...omitNode(props)}
    />
  ),
  strong: (props) => <strong className="font-semibold text-[var(--text-primary)]" {...omitNode(props)} />,
  code: ({ className, ...props }) => {
    // Fenced blocks carry a "language-x" className from remark and are
    // already boxed by the `pre` renderer below — only chip-style
    // genuinely inline code, or fenced blocks get double-boxed.
    if (className) return <code className={className} {...omitNode(props)} />;
    return (
      <code
        className="rounded px-1.5 py-0.5 font-[var(--font-mono)] text-[13px]"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        {...omitNode(props)}
      />
    );
  },
  pre: (props) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg p-4 font-[var(--font-mono)] text-[13px]"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      {...omitNode(props)}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-2 pl-4 italic text-[var(--text-muted)]"
      style={{ borderColor: "var(--border-strong)" }}
      {...omitNode(props)}
    />
  ),
};

export default function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
