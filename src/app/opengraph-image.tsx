import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/**
 * Dynamisch generiertes Open-Graph-/Social-Vorschaubild (1200×630).
 * Markendesign (dunkel + OTIGO-Grün), sorgt für hochwertige Link-Previews
 * auf LinkedIn, X, WhatsApp & Co. (wichtiger Social-/SEO-Signalgeber).
 */
export const alt = "TAS Webworks, Preiswerte Webagentur aus Berlin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(1200px 600px at 80% -10%, rgba(9,237,45,0.18), transparent), #050505",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "#09ed2d",
            }}
          />
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 700, color: "#fff" }}>
            TAS{" "}
            <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: "10px" }}>
              Webworks
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "40px",
              color: "#09ed2d",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            WEBAGENTUR · BERLIN
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "68px",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              maxWidth: "900px",
            }}
          >
            Preiswerte Websites, die dein Unternehmen wachsen lassen.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "30px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Schnell · SEO-optimiert · Festpreis · {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
