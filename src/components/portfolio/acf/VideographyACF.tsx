import { Camera, Aperture, Lightbulb, MapPin, Video } from "lucide-react";
import { VideographyACF } from "@/types/acf";

interface VideographyACFDisplayProps {
  acf: VideographyACF;
}

export function VideographyACFDisplay({ acf }: VideographyACFDisplayProps) {
  const items = [
    { icon: Camera, label: "กล้อง", value: acf.camera },
    { icon: Aperture, label: "เลนส์", value: acf.lens },
    { icon: Lightbulb, label: "แสง", value: acf.lighting },
    { icon: MapPin, label: "สถานที่", value: acf.location },
  ];

  return (
    <div className="flex flex-col gap-6">
      {acf.video_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายวิดีโอ</h3>
          <p className="text-muted">{acf.video_description}</p>
        </div>
      )}

      {acf.video_link && (
        <div>
          <h3 className="text-lg font-semibold mb-3">วิดีโอ</h3>
          <div className="flex items-center gap-3">
            <Video size={20} />
            <a
              href={acf.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              ดูวิดีโอเต็ม
            </a>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">ข้อมูลการถ่ายทำ</h3>
        <div className="flex flex-col gap-3">
          {items.map(({ icon: Icon, label, value }) =>
            value ? (
              <div key={label} className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium">{label}:</span>
                <span className="text-muted">{value}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
