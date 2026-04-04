import { Palette, Type, Layers } from "lucide-react";
import { GraphicDesignACF } from "@/types/acf";

interface GraphicDesignACFDisplayProps {
  acf: GraphicDesignACF;
}

export function GraphicDesignACFDisplay({ acf }: GraphicDesignACFDisplayProps) {
  const colors = acf.color_palette
    ?.split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {acf.design_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายงานออกแบบ</h3>
          <p className="text-muted">{acf.design_description}</p>
        </div>
      )}

      {acf.design_software && (
        <div>
          <h3 className="text-lg font-semibold mb-3">โปรแกรมที่ใช้</h3>
          <div className="flex items-center gap-3">
            <Palette size={20} />
            <span className="text-muted">{acf.design_software}</span>
          </div>
        </div>
      )}

      {colors && colors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">สีหลักที่ใช้</h3>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <div
                key={color}
                className="w-[60px] h-[60px] rounded-md border border-edge"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {acf.typography && (
        <div>
          <h3 className="text-lg font-semibold mb-3">ฟอนต์ที่ใช้</h3>
          <div className="flex items-center gap-3">
            <Type size={20} />
            <span className="text-muted">{acf.typography}</span>
          </div>
        </div>
      )}

      {acf.design_elements && (
        <div>
          <h3 className="text-lg font-semibold mb-3">องค์ประกอบการออกแบบ</h3>
          <div className="flex items-center gap-3">
            <Layers size={20} />
            <span className="text-muted">{acf.design_elements}</span>
          </div>
        </div>
      )}
    </div>
  );
}
