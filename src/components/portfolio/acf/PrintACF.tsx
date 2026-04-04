import { FileText, Ruler, Package } from "lucide-react";
import { PrintACF } from "@/types/acf";

interface PrintACFDisplayProps {
  acf: PrintACF;
}

export function PrintACFDisplay({ acf }: PrintACFDisplayProps) {
  const items = [
    { icon: Ruler, label: "ขนาด", value: acf.print_size },
    { icon: Package, label: "วัสดุ", value: acf.print_material },
    { icon: FileText, label: "โปรแกรมที่ใช้", value: acf.print_software },
  ];

  return (
    <div className="flex flex-col gap-6">
      {acf.print_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายงานพิมพ์</h3>
          <p className="text-muted">{acf.print_description}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">ข้อมูลงานพิมพ์</h3>
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
