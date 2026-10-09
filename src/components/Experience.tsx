"use client";

import { useTheme } from "@/lib/theme-context";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";
import ExperienceClassic from "@/components/ExperienceClassic";
import ExperienceTimeline from "@/components/ExperienceTimeline";

// Which layout the default theme shows. "classic" = the stacked cards (live);
// "timeline" = the sticky-rail timeline, archived in ExperienceTimeline.tsx
// while the layout decision is pending. The signal theme always uses classic.
const EXPERIENCE_LAYOUT = "classic" as "classic" | "timeline";

export default function Experience() {
  const { theme } = useTheme();
  const isSignal = theme === "b";
  const useTimeline = !isSignal && EXPERIENCE_LAYOUT === "timeline";

  return (
    <Band id="experience" tone="sand">
      <SectionHeading
        label="Experience"
        title={"10+ years of shipping"}
        emphasis={"production platforms."}
        signalLabel="experience"
        signalTitle="git log --career --oneline"
      />

      {useTimeline ? <ExperienceTimeline /> : <ExperienceClassic />}
    </Band>
  );
}
