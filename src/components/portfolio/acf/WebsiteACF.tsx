import { Code, Globe } from "lucide-react";
import { WebsiteACF } from "@/types/acf";

interface WebsiteACFDisplayProps {
  acf: WebsiteACF;
}

export function WebsiteACFDisplay({ acf }: WebsiteACFDisplayProps) {
  return (
    <div className="flex flex-col gap-6">
      {acf.project_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายโปรเจค</h3>
          <p className="text-muted">{acf.project_description}</p>
        </div>
      )}

      {acf.tech_stack && (
        <div>
          <h3 className="text-lg font-semibold mb-3">เทคโนโลยีที่ใช้</h3>
          <div className="flex items-center gap-3">
            <Code size={20} />
            <span className="text-muted">{acf.tech_stack}</span>
          </div>
        </div>
      )}

      {acf.features && (
        <div>
          <h3 className="text-lg font-semibold mb-3">ฟีเจอร์หลัก</h3>
          <p className="text-muted whitespace-pre-line">{acf.features}</p>
        </div>
      )}

      {acf.website_url && (
        <div className="border border-edge rounded-lg">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Globe size={24} />
              <div className="flex-1">
                <p className="font-bold mb-1">เว็บไซต์</p>
                <a
                  href={acf.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {acf.website_url}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
