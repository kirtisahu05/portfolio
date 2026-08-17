import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0a0e14",
          color: "#e6ede6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#7ee787", fontSize: 28, letterSpacing: 2 }}>
          {profile.handle}
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 64, fontWeight: 700 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 32, color: "#8b9a8f" }}>
          {profile.role} · {profile.location}
        </div>
      </div>
    ),
    { ...size }
  );
}
