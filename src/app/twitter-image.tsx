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
          background: "linear-gradient(135deg, #1DA1F2 0%, #0d7fc7 100%)",
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
        {/* Twitter-style background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 75% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)",
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
              fontSize: "64px",
              fontWeight: "bold",
              marginBottom: "20px",
              lineHeight: "1.1",
            }}
          >
            {siteConfig.authorTh}
          </h1>

          <p
            style={{
              fontSize: "28px",
              marginBottom: "30px",
              opacity: 0.9,
              lineHeight: "1.4",
            }}
          >
            ผู้ผลิตสื่อมืออาชีพ
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["📸", "🎥", "💻", "🎨"].map((emoji, index) => (
              <div
                key={index}
                style={{
                  fontSize: "40px",
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "10px",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
            opacity: 0.8,
          }}
        >
          @visarutsankham
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
