"use client";

import { Phone, Mail, X } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        handleTabKey(e);
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";

      if (previousFocusRef.current && !isOpen) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, handleTabKey]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[1000]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="ช่องทางติดต่อ"
        tabIndex={-1}
        className="fixed top-4 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 bg-surface rounded-lg border border-edge p-4 md:p-6 max-w-[90vw] md:max-w-[400px] w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto z-[1001]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold text-content">
              ติดต่อ
            </h2>
            <button
              aria-label="ปิดหน้าต่างติดต่อ"
              onClick={onClose}
              className="p-1 md:p-2 rounded hover:bg-surface-hover text-muted"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-3 md:gap-4">
            {/* Email Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Mail size={20} className="text-dim" />
                <span className="text-base font-semibold text-muted">
                  ส่งรายละเอียดโครงการ
                </span>
              </div>
              <p className="text-lg text-content font-medium pl-8">
                visarut298@gmail.com
              </p>
            </div>

            {/* Phone Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Phone size={20} className="text-dim" />
                <span className="text-base font-semibold text-muted">
                  โทรติดต่อ
                </span>
              </div>
              <p className="text-lg text-content font-medium pl-8">
                062-7283058
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 md:gap-3 pt-2">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open("mailto:visarut298@gmail.com", "_blank");
                }
              }}
              className="w-full bg-accent text-base hover:bg-[#d97706] text-sm md:text-base py-2 md:py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Mail size={16} />
              <span>ส่งอีเมล</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open("tel:0627283058", "_self");
                }
              }}
              className="w-full border border-edge text-muted hover:bg-surface-hover text-sm md:text-base py-2 md:py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={16} />
              <span>โทรเลย</span>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
