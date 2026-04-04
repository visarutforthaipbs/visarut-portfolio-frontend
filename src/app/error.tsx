"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { reportError } from "@/lib/errorReporting";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { context: "global-error-boundary", metadata: { digest: error.digest } });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-accent">
            <AlertTriangle size={64} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-content">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-base md:text-lg text-muted">
            ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง
          </p>
          <p className="text-sm text-dim">
            Something went wrong. Please try again.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={reset}
              className="w-full bg-accent text-base hover:bg-[#d97706] py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={18} />
              ลองใหม่อีกครั้ง
            </button>
            <Link href="/" className="w-full">
              <button className="w-full border border-edge text-muted hover:bg-surface py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
                <Home size={18} />
                กลับหน้าแรก
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
