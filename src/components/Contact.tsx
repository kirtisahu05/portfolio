"use client";

import { useState } from "react";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiMedium } from "react-icons/si";
import { TbCalendarUser, TbCheck, TbCopy } from "react-icons/tb";
import type { IconType } from "react-icons";
import { consulting, contactCta, profile } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import SchedulingDialog, { isEmbeddableSchedule } from "./SchedulingDialog";
import SectionIntro from "@/components/SectionIntro";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";

// Previous Contact layout (consulting card + link grid) — kept as the signal
// theme's version. The default theme renders DefaultContact below.
function SignalContact() {
  const isSignal = true;
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const embeddable = isEmbeddableSchedule(consulting.ctaUrl);

  const links = [
    { label: "LinkedIn", value: profile.links.linkedin },
    { label: "GitHub", value: profile.links.github },
    { label: "Medium", value: profile.links.medium },
    { label: "Topmate", value: profile.links.topmate },
    // { label: "LeetCode", value: profile.links.leetcode },
    // { label: "YouTube", value: profile.links.youtube },
  ].filter((link) => link.value);

  return (
    <section
      id="contact"
      className="page-container py-14"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {isSignal && (
        <p className="mb-2 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
          contact
        </p>
      )}
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "connect --preferred-channel" : "Get in touch"}
      </h2>
      <SectionIntro>Open to senior/architect-level frontend and AI-adjacent full-stack roles.</SectionIntro>

      <div
        className="mt-6 rounded-lg border p-5"
        style={{ borderColor: "var(--accent)", background: "var(--bg-elevated)" }}
      >
        {isSignal && (
          <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
            $ cat consulting.txt
          </p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="text-left text-sm leading-relaxed text-[var(--text-secondary)]">
            {consulting.blurb}
          </p>
          <a
            href={consulting.ctaUrl || `mailto:${profile.email}?subject=Consulting%20inquiry`}
            target={consulting.ctaUrl ? "_blank" : undefined}
            rel={consulting.ctaUrl ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              // Plain clicks open the booking page in-page; modifier clicks and
              // no-JS still get the new-tab link.
              if (!embeddable || e.metaKey || e.ctrlKey || e.shiftKey) return;
              e.preventDefault();
              setSchedulingOpen(true);
            }}
            className="shrink-0 self-start whitespace-nowrap rounded-[var(--btn-radius)] px-5 py-2.5 text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] transition hover:opacity-90 active:scale-[0.98] sm:self-auto"
          >
            {consulting.ctaLabel}
          </a>
        </div>
        {embeddable && (
          <SchedulingDialog
            url={consulting.ctaUrl}
            open={schedulingOpen}
            onClose={() => setSchedulingOpen(false)}
          />
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-lg border p-5"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          {isSignal && (
            <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
              $ cat contact.txt
            </p>
          )}
          <a href={`mailto:${profile.email}`} className="block text-sm text-[var(--accent)]">
            {profile.email}
          </a>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{profile.location}</p>
          {/* <p className="mt-1 text-sm text-[var(--text-secondary)]">{profile.workPreference}</p> */}
        </div>

        {links.map((link) => (
          <a
            key={link.label}
            href={link.value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-lg border p-5 hover:border-[var(--border-strong)]"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{link.label}</p>
              <p className="mt-0.5 font-[var(--font-mono)] text-xs text-[var(--text-muted)]">
                {link.value?.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// "Not ready to talk yet? Find me on LinkedIn · GitHub · Medium · Topmate" row
// under the default-theme Contact section. Hidden for now, not deleted — flip
// to true to bring it back.
const SHOW_ELSEWHERE = false;

// The plain email address + "Copy" button under the Contact buttons. Hidden for
// now, not deleted (the "Email me" button still opens a mail draft) — flip to
// true to bring it back.
const SHOW_EMAIL_COPY = false;

const ELSEWHERE: { label: string; href: string; icon: IconType }[] = [
  { label: "LinkedIn", href: profile.links.linkedin, icon: FaLinkedin },
  { label: "GitHub", href: profile.links.github, icon: SiGithub },
  { label: "Medium", href: profile.links.medium, icon: SiMedium },
  // No Topmate brand icon in react-icons — a calendar-with-person stands in.
  { label: "Topmate", href: profile.links.topmate, icon: TbCalendarUser },
].filter((link) => link.href);

// Default theme: a centered closing call to action on a sand band (BotFriday's "Tell
// us about the role."). Email leads — with a copy button, since mailto links
// do nothing for visitors without a mail app set up.
function DefaultContact() {
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const embeddable = isEmbeddableSchedule(consulting.ctaUrl);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions/insecure context) — the address is
      // visible right next to the button, so nothing else to do.
    }
  }

  return (
    <Band id="contact" tone="sand">
      <div className="text-center">
        <SectionHeading
          label={contactCta.label}
          title={contactCta.title}
          emphasis={contactCta.emphasis}
          signalLabel="contact"
          signalTitle="connect --preferred-channel"
          align="center"
        />
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-[var(--text-secondary)]">
          {contactCta.intro}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={consulting.ctaUrl || `mailto:${profile.email}?subject=Let%27s%20talk`}
            target={consulting.ctaUrl ? "_blank" : undefined}
            rel={consulting.ctaUrl ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              // Plain clicks open the booking page in-page; modifier clicks
              // still get the new-tab link.
              if (!embeddable || e.metaKey || e.ctrlKey || e.shiftKey) return;
              e.preventDefault();
              setSchedulingOpen(true);
            }}
            className="inline-flex items-center rounded-[var(--btn-radius)] px-6 py-3 text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] transition hover:opacity-90 active:scale-[0.98]"
          >
            {consulting.ctaLabel}
            <span className="btn-dot" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-[var(--btn-radius)] border px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-elevated)] active:scale-[0.98]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            {contactCta.emailLabel}
          </a>
        </div>

        {SHOW_EMAIL_COPY && (
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
            {profile.email}
            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? "Email copied" : "Copy email address"}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-[var(--accent)] hover:bg-[var(--bg-elevated)]"
            >
              {copied ? <TbCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <TbCopy className="h-3.5 w-3.5" aria-hidden="true" />}
              <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            </button>
          </p>
        )}

        <div className="mt-14 grid gap-8 border-t pt-10 text-left sm:grid-cols-3" style={{ borderColor: "var(--border)" }}>
          {contactCta.columns.map((col) => (
            <div key={col.label}>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
                {col.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{col.text}</p>
            </div>
          ))}
        </div>

        {SHOW_ELSEWHERE && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--text-muted)]">
            <span>{contactCta.elsewhereLabel}</span>
            {ELSEWHERE.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[var(--text-primary)] transition hover:border-[var(--accent)]"
                style={{ borderColor: "var(--border)" }}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
                <span aria-hidden="true" className="text-[var(--text-muted)]">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {embeddable && (
        <SchedulingDialog url={consulting.ctaUrl} open={schedulingOpen} onClose={() => setSchedulingOpen(false)} />
      )}
    </Band>
  );
}

export default function Contact() {
  const { theme } = useTheme();
  return theme === "b" ? <SignalContact /> : <DefaultContact />;
}
