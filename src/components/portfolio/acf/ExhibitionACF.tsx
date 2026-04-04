import { MapPin, Calendar, Briefcase } from "lucide-react";
import { ExhibitionACF } from "@/types/acf";

interface ExhibitionACFDisplayProps {
  acf: ExhibitionACF;
}

export function ExhibitionACFDisplay({ acf }: ExhibitionACFDisplayProps) {
  const items = [
    { icon: MapPin, label: "สถานที่", value: acf.location },
    { icon: Calendar, label: "วันที่", value: acf.date },
    { icon: Briefcase, label: "บทบาท", value: acf.role },
  ];

  return (
    <div className="flex flex-col gap-6">
      {acf.exhibition_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายนิทรรศการ</h3>
          <p className="text-muted">{acf.exhibition_description}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">ข้อมูลนิทรรศการ</h3>
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
