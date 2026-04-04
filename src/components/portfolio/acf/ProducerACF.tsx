import { Users, Clock, ListChecks } from "lucide-react";
import { ProducerACF } from "@/types/acf";

interface ProducerACFDisplayProps {
  acf: ProducerACF;
}

export function ProducerACFDisplay({ acf }: ProducerACFDisplayProps) {
  const items = [
    { icon: Users, label: "ขนาดทีม", value: acf.team_size },
    { icon: Clock, label: "ระยะเวลา", value: acf.duration },
  ];

  return (
    <div className="flex flex-col gap-6">
      {acf.producer_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายงานโปรดิวเซอร์</h3>
          <p className="text-muted">{acf.producer_description}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">ข้อมูลโปรเจค</h3>
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

      {acf.responsibilities && (
        <div>
          <h3 className="text-lg font-semibold mb-3">หน้าที่รับผิดชอบ</h3>
          <div className="flex items-start gap-3">
            <ListChecks size={20} />
            <p className="text-muted whitespace-pre-line">{acf.responsibilities}</p>
          </div>
        </div>
      )}
    </div>
  );
}
