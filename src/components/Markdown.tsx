import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Content copied from some sources (e.g. a rendered table pasted out of a
// chat UI) arrives with every cell — and every "|" — exploded onto its own
// line, instead of one pipe-delimited line per row. remark-gfm requires the
// latter, so a table like that renders as broken paragraphs instead of a
// table. This reassembles any such block back into normal single-line rows
// before handing the content to ReactMarkdown; well-formed tables pass
// through untouched since they never contain a line that's just "|".
function repairBrokenGfmTables(markdown: string): string {
  const lines = markdown.split("\n");
  const delimiterRe = /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/;
  // A lone "|" inside a fenced code block (e.g. a shell pipeline in an
  // example) isn't a broken table row — track fence state so those lines
  // pass through untouched instead of triggering row detection.
  const fenceRe = /^ {0,3}(`{3,}|~{3,})/;
  const out: string[] = [];
  let i = 0;
  let inFence = false;

  while (i < lines.length) {
    if (fenceRe.test(lines[i])) {
      inFence = !inFence;
      out.push(lines[i]);
      i++;
      continue;
    }

    if (inFence || lines[i].trim() !== "|") {
      out.push(lines[i]);
      i++;
      continue;
    }

    // Bare "|" line found — collect header tokens up to the delimiter row.
    const start = i;
    i++;
    const headerTokens: string[] = [];
    while (i < lines.length && !delimiterRe.test(lines[i].trim())) {
      const t = lines[i].trim();
      if (t !== "") headerTokens.push(t);
      i++;
    }

    if (i >= lines.length) {
      // No delimiter ever showed up, so this wasn't a table after all —
      // preserve everything consumed unchanged.
      for (let j = start; j < lines.length; j++) out.push(lines[j]);
      break;
    }

    const delimiterLine = lines[i].trim();
    const numColumns = delimiterLine.split("|").filter((s) => s.trim() !== "").length;
    out.push(`| ${headerTokens.join(" ")}`, delimiterLine);
    i++;

    // Broken body rows: each is a run of tokens containing exactly
    // numColumns + 1 "|" markers.
    while (i < lines.length) {
      while (i < lines.length && lines[i].trim() === "") i++;
      if (i >= lines.length || lines[i].trim() !== "|") break;

      const rowTokens: string[] = [];
      let pipeCount = 0;
      while (i < lines.length && pipeCount < numColumns + 1) {
        const t = lines[i].trim();
        if (t !== "") {
          rowTokens.push(t);
          if (t === "|") pipeCount++;
        }
        i++;
      }
      out.push(rowTokens.join(" "));
    }
  }

  return out.join("\n");
}

// react-markdown injects a `node` prop (the underlying hast node) into every
// custom component — spreading the rest of props onto a DOM element without
// stripping it first leaks a stray node="[object Object]" attribute into
// the rendered HTML.
function omitNode<T extends { node?: unknown }>(props: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude it from `rest`
  const { node, ...rest } = props;
  return rest;
}

// remark-gfm assigns its own className to some elements (e.g. "contains-task-list"
// on a <ul> that holds task items) — {...omitNode(props)} is spread BEFORE the
// className below in every renderer so a real incoming className never
// silently overwrites the one meant for this component.
const components: Components = {
  h1: (props) => (
    <h1
      {...omitNode(props)}
      className="mt-8 mb-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] first:mt-0"
    />
  ),
  h2: (props) => (
    <h2
      {...omitNode(props)}
      className="mt-7 mb-3 font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)] first:mt-0"
    />
  ),
  h3: (props) => (
    <h3
      {...omitNode(props)}
      className="mt-6 mb-2 font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)] first:mt-0"
    />
  ),
  // Content sourced from a sheet cell can go straight from an h3 into an h4
  // (there's no outline enforcement upstream), so h4-h6 get their own sized
  // step down rather than falling back to the browser's unstyled default.
  h4: (props) => (
    <h4
      {...omitNode(props)}
      className="mt-5 mb-2 font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)] first:mt-0"
    />
  ),
  h5: (props) => (
    <h5
      {...omitNode(props)}
      className="mt-4 mb-1.5 font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)] first:mt-0"
    />
  ),
  h6: (props) => (
    <h6
      {...omitNode(props)}
      className="mt-4 mb-1.5 font-[var(--font-display)] text-sm font-semibold text-[var(--text-muted)] first:mt-0"
    />
  ),
  p: (props) => <p {...omitNode(props)} className="my-4" />,
  ul: (props) => <ul {...omitNode(props)} className="my-4 list-disc space-y-1.5 pl-6" />,
  ol: (props) => <ol {...omitNode(props)} className="my-4 list-decimal space-y-1.5 pl-6" />,
  a: (props) => (
    <a
      {...omitNode(props)}
      className="underline decoration-[var(--border-strong)] underline-offset-2 hover:text-[var(--text-primary)]"
      style={{ color: "var(--accent)" }}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    />
  ),
  strong: (props) => <strong {...omitNode(props)} className="font-semibold text-[var(--text-primary)]" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element -- external, unknown-dimension sheet-supplied URLs
    <img
      {...omitNode(props)}
      alt={props.alt ?? ""}
      className="my-4 max-w-full rounded-lg"
      style={{ border: "1px solid var(--border)" }}
    />
  ),
  del: (props) => <del {...omitNode(props)} className="text-[var(--text-muted)]" />,
  code: ({ className, ...props }) => {
    // Fenced blocks carry a "language-x" className from remark and are
    // already boxed by the `pre` renderer below — only chip-style
    // genuinely inline code, or fenced blocks get double-boxed.
    if (className) return <code {...omitNode(props)} className={className} />;
    return (
      <code
        {...omitNode(props)}
        className="rounded px-1.5 py-0.5 font-[var(--font-mono)] text-[13px]"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      />
    );
  },
  pre: (props) => (
    <pre
      {...omitNode(props)}
      className="my-4 overflow-x-auto rounded-lg p-4 font-[var(--font-mono)] text-[13px]"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...omitNode(props)}
      className="my-4 border-l-2 pl-4 italic text-[var(--text-muted)]"
      style={{ borderColor: "var(--border-strong)" }}
    />
  ),
  // GFM tables (comparison tables are common in this content) need their own
  // scroll container — a wide table would otherwise force the whole article
  // column to overflow horizontally.
  table: (props) => (
    <div className="my-4 overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
      <table {...omitNode(props)} className="w-full border-collapse text-sm" />
    </div>
  ),
  thead: (props) => <thead {...omitNode(props)} style={{ background: "var(--bg-elevated)" }} />,
  th: (props) => (
    <th
      {...omitNode(props)}
      className="whitespace-nowrap px-3 py-2 text-left font-semibold text-[var(--text-primary)]"
      style={{ borderBottom: "1px solid var(--border)" }}
    />
  ),
  td: (props) => (
    <td
      {...omitNode(props)}
      className="px-3 py-2 align-top text-[var(--text-secondary)]"
      style={{ borderTop: "1px solid var(--border)" }}
    />
  ),
  // GFM task-list items carry a "task-list-item" className — swap in "list-none"
  // so .log-content's `ul` bullet marker doesn't double up with the checkbox
  // the `input` renderer below adds as the item's first child.
  li: (props) => {
    const isTaskItem = typeof props.className === "string" && props.className.includes("task-list-item");
    return <li {...omitNode(props)} className={isTaskItem ? "list-none" : undefined} />;
  },
  input: (props) => <input {...omitNode(props)} className="mr-1.5 align-middle" disabled />,
};

export default function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {repairBrokenGfmTables(content)}
      </ReactMarkdown>
    </div>
  );
}
