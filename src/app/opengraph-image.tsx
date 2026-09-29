import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse can't read CSS variables — these mirror theme "a" in
// globals.css (the palette visitors see), so link previews match the site.
// Keep them in sync if that palette changes.
const colors = {
  bg: "#fef7e5",
  textPrimary: "#00311e",
  textSecondary: "#2d4c3c",
  textMuted: "#547061",
  border: "#5f7d6a",
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: colors.bg,
          color: colors.textPrimary,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: colors.textMuted, fontSize: 26, letterSpacing: 3 }}>
          {profile.handle}
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 68, fontWeight: 700 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, fontSize: 32, color: colors.textSecondary }}>
          {profile.role}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            paddingTop: 24,
            borderTop: `2px solid ${colors.border}`,
            fontSize: 24,
            color: colors.textMuted,
          }}
        >
          React · Next.js · TypeScript · Frontend Architecture · Technical Leadership
        </div>
      </div>
    ),
    { ...size }
  );
}
