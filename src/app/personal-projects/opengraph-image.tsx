import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "#PHOTOFORAIR - แคมเปญเปลี่ยนภาพเพื่ออากาศที่เท่ากัน";
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
          background: "linear-gradient(180deg, #1a1a1a 0%, #4a4a4a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          position: "relative",
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
        }}
      >
        {/* Top Badge */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            display: "flex",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "rgba(100, 100, 100, 0.8)",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "18px",
            }}
          >
            Social Campaign
          </div>
          <div
            style={{
              background: "rgba(100, 100, 100, 0.8)",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "18px",
            }}
          >
            Photography
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "900px",
            padding: "0 60px",
          }}
        >
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              marginBottom: "20px",
              lineHeight: "1.1",
              letterSpacing: "-2px",
            }}
          >
            #PHOTOFORAIR
          </h1>

          <p
            style={{
              fontSize: "36px",
              marginBottom: "40px",
              opacity: 0.95,
              lineHeight: "1.3",
            }}
          >
            เปลี่ยนภาพถ่ายเพื่อ
            <br />
            อากาศที่เท่ากัน
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "20px 40px",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                13,016 บาท
              </div>
              <div style={{ fontSize: "18px", opacity: 0.8 }}>
                จำนวนเงินที่ได้
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "20px 40px",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                591 ชิ้น
              </div>
              <div style={{ fontSize: "18px", opacity: 0.8 }}>หน้ากาก N95</div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
            opacity: 0.7,
          }}
        >
          แคมเปญตั้งแต่ปี 2564 | ช่วยเหลือแรงงานข้ามชาติในเชียงใหม่
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
