import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

interface OGImageOptions {
  title: string;
  description?: string;
  siteName?: string;
}

let fontCache: { data: ArrayBuffer; name: string } | null = null;

async function loadFont(): Promise<{ data: ArrayBuffer; name: string }> {
  if (fontCache) return fontCache;

  // Try fetching Geist Bold from Google Fonts
  try {
    const res = await fetch(
      "https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOI.woff"
    );
    if (res.ok) {
      fontCache = { data: await res.arrayBuffer(), name: "Geist" };
      return fontCache;
    }
  } catch {
    // Fall through to local fallback
  }

  // Fallback: Noto Sans bundled with next/og (always available at build time)
  const notoPath = join(
    process.cwd(),
    "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf"
  );
  const data = await readFile(notoPath);
  fontCache = { data: data.buffer as ArrayBuffer, name: "Noto Sans" };
  return fontCache;
}

export async function generateOGImage({
  title,
  description,
  siteName = "patricedouge.com",
}: OGImageOptions): Promise<ImageResponse> {
  const font = await loadFont();

  const fonts = [
    {
      name: font.name,
      data: font.data,
      style: "normal" as const,
      weight: 700 as const,
    },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          padding: "60px",
          fontFamily: font.name,
        }}
      >
        {/* Top: Logo + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            PD
          </div>
          <span style={{ color: "#a1a1aa", fontSize: "22px" }}>
            Patrice Douge
          </span>
        </div>

        {/* Center: Title + Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              color: "#fafafa",
              fontSize: "56px",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                color: "#a1a1aa",
                fontSize: "24px",
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom: Accent bar + Site URL */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "40px",
              height: "4px",
              backgroundColor: "#3b82f6",
              borderRadius: "2px",
            }}
          />
          <span style={{ color: "#71717a", fontSize: "18px" }}>
            {siteName}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}
