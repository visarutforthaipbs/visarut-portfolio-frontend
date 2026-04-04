import { Film, Video } from "lucide-react";
import { VideoEditingACF } from "@/types/acf";

interface VideoEditingACFDisplayProps {
  acf: VideoEditingACF;
}

export function VideoEditingACFDisplay({ acf }: VideoEditingACFDisplayProps) {
  return (
    <div className="flex flex-col gap-6">
      {acf.editing_description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">คำอธิบายการตัดต่อ</h3>
          <p className="text-muted">{acf.editing_description}</p>
        </div>
      )}

      {acf.software && (
        <div>
          <h3 className="text-lg font-semibold mb-3">ซอฟต์แวร์ที่ใช้</h3>
          <div className="flex items-center gap-3">
            <Film size={20} />
            <span className="text-muted">{acf.software}</span>
          </div>
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
    </div>
  );
}
