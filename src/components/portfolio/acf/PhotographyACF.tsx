import { Camera, Aperture, Lightbulb, MapPin } from "lucide-react";
import { PhotographyACF } from "@/types/acf";

interface PhotographyACFDisplayProps {
  acf: PhotographyACF;
}

export function PhotographyACFDisplay({ acf }: PhotographyACFDisplayProps) {
  const items = [
    { icon: Camera, label: "กล้อง", value: acf.camera },
    { icon: Aperture, label: "เลนส์", value: acf.lens },
    { icon: Lightbulb, label: "แสง", value: acf.lighting },
    { icon: MapPin, label: "สถานที่", value: acf.location },
  ];

  return (
    <div className="flex flex-col gap-6">
      {acf.photo_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายภาพถ่าย</h3>
          <p className="text-muted">{acf.photo_description}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">ข้อมูลการถ่ายภาพ</h3>
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
