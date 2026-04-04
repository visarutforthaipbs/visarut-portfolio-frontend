import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-dim">
            <FileQuestion size={80} />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-edge leading-none">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-content">
            ไม่พบหน้าที่ต้องการ
          </h2>
          <p className="text-base md:text-lg text-muted max-w-sm">
            หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่มีอยู่
          </p>
          <p className="text-sm text-dim">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs pt-4">
            <Link href="/" className="w-full">
              <button className="w-full bg-accent text-base hover:bg-[#d97706] py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
                <Home size={18} />
                กลับหน้าแรก
              </button>
            </Link>
            <Link href="/portfolio" className="w-full">
              <button className="w-full border border-edge text-muted hover:bg-surface py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={18} />
                ดูผลงาน
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
