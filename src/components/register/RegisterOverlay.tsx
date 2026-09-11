"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export default function RegisterOverlay({
  children,
  standalone = false,
}: {
  children: ReactNode;
  standalone?: boolean;
}) {
  const router = useRouter();

  function handleClose() {
    if (standalone) {
      router.push("/");
    } else {
      router.back();
    }
  }

  function handleBackdropClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) handleClose();
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 py-10 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-3xl bg-surface p-8 shadow-2xl shadow-black/30"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-surface-tint hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
