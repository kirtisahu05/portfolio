// Animated connector lane used by the Ask AI walkthrough and the YourBot
// architecture diagram. Styling and keyframes live in globals.css
// (.flow-lane / .flow-token / flow-move, flow-drop, flow-join, flow-word).
//   - "chunk"/"word": shown one at a time (flow-word is timed for exactly
//     three per lane); "chunk" is muted mono text, "word" is the mint reply.
//   - plain/"drop"/"join": continuous characters spread along the lane;
//     "drop" falls out mid-lane (filtered), "join" drops in from above.
export type FlowToken = { t: string; kind?: "drop" | "join" | "word" | "chunk" };
export type FlowLaneData = { duration: number; tokens: FlowToken[] };

const isOneAtATime = (tok: FlowToken) => tok.kind === "word" || tok.kind === "chunk";

export default function FlowLane({ lane, active }: { lane: FlowLaneData; active: boolean }) {
  // One-at-a-time tokens and continuous tokens are staggered independently,
  // each across its own count.
  const sequenced = lane.tokens.filter(isOneAtATime);
  const continuous = lane.tokens.filter((tok) => !isOneAtATime(tok));
  return (
    <div className={`flow-lane h-12 ${active ? "flow-lane--active" : ""}`} aria-hidden="true">
      {lane.tokens.map((tok, i) => {
        const group = isOneAtATime(tok) ? sequenced : continuous;
        const n = group.length;
        const k = group.indexOf(tok);
        // Negative delays spread tokens out from the first frame instead of
        // all starting at the left edge together. Continuous characters read
        // left→right as a ticker; one-at-a-time chunks are staggered the other
        // way so they arrive in reading order.
        const slot = isOneAtATime(tok) ? (n - k) % n : k;
        return (
          <span
            key={i}
            className={`flow-token ${tok.kind ? `flow-token--${tok.kind}` : ""}`}
            style={{ animationDuration: `${lane.duration}s`, animationDelay: `${-((slot * lane.duration) / n)}s` }}
          >
            {tok.t}
          </span>
        );
      })}
    </div>
  );
}
