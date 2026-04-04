import { User, Calendar, TrendingUp, Radio } from "lucide-react";
import { CampaignACF } from "@/types/acf";

interface CampaignACFDisplayProps {
  acf: CampaignACF;
}

export function CampaignACFDisplay({ acf }: CampaignACFDisplayProps) {
  const items = [
    { icon: User, label: "ลูกค้า", value: acf.client },
    { icon: Calendar, label: "ระยะเวลา", value: acf.campaign_duration },
    { icon: Radio, label: "แพลตฟอร์ม", value: acf.platform },
  ];

  return (
    <div className="flex flex-col gap-6">
      {acf.campaign_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายแคมเปญ</h3>
          <p className="text-muted">{acf.campaign_description}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">ข้อมูลแคมเปญ</h3>
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

      {acf.results && (
        <div>
          <h3 className="text-lg font-semibold mb-3">ผลลัพธ์</h3>
          <div className="flex items-start gap-3">
            <TrendingUp size={20} />
            <p className="text-muted whitespace-pre-line">{acf.results}</p>
          </div>
        </div>
      )}
    </div>
  );
}
