"use client";

import type { ReactNode } from "react";
import { FUJI_WHATSAPP_DISPLAY } from "@/lib/whatsapp";

type Props = {
  href: string;
  children?: ReactNode;
  className?: string;
  /** Visually secondary (outline) vs primary CTA */
  variant?: "primary" | "secondary";
};

/**
 * Opens a prefilled WhatsApp inquiry. Never implies payment or reservation.
 */
export function WhatsAppInquiryLink({
  href,
  children,
  className,
  variant = "secondary",
}: Props) {
  const btnClass = variant === "primary" ? "btn btn-primary" : "btn btn-secondary";
  return (
    <a
      href={href}
      className={className ?? btnClass}
      target="_blank"
      rel="noopener noreferrer"
      data-inquiry="whatsapp"
    >
      {children ?? `WhatsApp inquiry (${FUJI_WHATSAPP_DISPLAY})`}
    </a>
  );
}
