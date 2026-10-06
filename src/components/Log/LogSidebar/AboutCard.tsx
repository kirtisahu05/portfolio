import { profile } from "@/lib/content";

export default function AboutCard() {
  return (
    <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <p className="log-label mb-2">
        about
      </p>
      <h3
        className="font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]"
        style={{ textTransform: "none" }}
      >
        {profile.name}
      </h3>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        {profile.role} · {profile.location}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">{profile.logTagline}</p>
    </div>
  );
}
