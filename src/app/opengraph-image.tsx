import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const runtime = "edge";

export const alt = siteConfig.titleTh;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "800px",
            padding: "0 40px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              marginBottom: "24px",
              lineHeight: "1.1",
            }}
          >
            {siteConfig.authorTh}
          </h1>

          <p
            style={{
              fontSize: "32px",
              marginBottom: "40px",
              opacity: 0.9,
              lineHeight: "1.4",
            }}
          >
            {siteConfig.descriptionTh}
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["ภาพถ่าย", "วิดีโอ", "เว็บไซต์", "กราฟิก"].map((service) => (
              <div
                key={service}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "8px 20px",
                  borderRadius: "25px",
                  fontSize: "20px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            fontSize: "24px",
            opacity: 0.8,
          }}
        >
          🌐 {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
