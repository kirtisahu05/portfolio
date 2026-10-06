import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse can't read CSS variables — these mirror theme "a" in
// globals.css (the palette visitors see), so link previews match the site.
// Keep them in sync if that palette changes.
const colors = {
  bg: "#fbf6eb",
  textPrimary: "#0a221f",
  textSecondary: "#3f524d",
  textMuted: "#5e6e67",
  border: "#9afba4",
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
            borderTop: `4px solid ${colors.border}`,
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
