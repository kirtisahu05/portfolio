import ReactMarkdown from "react-markdown";

export default function LogContent({ content }: { content: string }) {
  return (
    <div className="log-content max-w-none text-[15px] leading-relaxed text-[var(--text-secondary)]">
      <ReactMarkdown
        components={{
          h1: (props) => (
            <h1
              className="mt-8 mb-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] first:mt-0"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="mt-7 mb-3 font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)] first:mt-0"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="mt-6 mb-2 font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)] first:mt-0"
              {...props}
            />
          ),
          p: (props) => <p className="my-4" {...props} />,
          ul: (props) => <ul className="my-4 list-disc space-y-1.5 pl-6" {...props} />,
          ol: (props) => <ol className="my-4 list-decimal space-y-1.5 pl-6" {...props} />,
          a: (props) => (
            <a
              className="underline decoration-[var(--border-strong)] underline-offset-2 hover:text-[var(--text-primary)]"
              style={{ color: "var(--accent)" }}
              target={props.href?.startsWith("http") ? "_blank" : undefined}
              rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            />
          ),
          strong: (props) => <strong className="font-semibold text-[var(--text-primary)]" {...props} />,
          code: ({ className, ...props }) => {
            // Fenced blocks carry a "language-x" className from remark and are
            // already boxed by the `pre` renderer below — only chip-style
            // genuinely inline code, or fenced blocks get double-boxed.
            if (className) return <code className={className} {...props} />;
            return (
              <code
                className="rounded px-1.5 py-0.5 font-[var(--font-mono)] text-[13px]"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                {...props}
              />
            );
          },
          pre: (props) => (
            <pre
              className="my-4 overflow-x-auto rounded-lg p-4 font-[var(--font-mono)] text-[13px]"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-4 border-l-2 pl-4 italic text-[var(--text-muted)]"
              style={{ borderColor: "var(--border-strong)" }}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
