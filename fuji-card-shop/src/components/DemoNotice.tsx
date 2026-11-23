import type { ReactNode } from "react";

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-banner" role="status">
      {children ?? (
        <>
          <strong>Inquiry storefront</strong> — live card checkout and PayFast are disabled.
          WhatsApp opens an availability request only; nothing here is payment, acceptance, or a
          reservation. No production inventory is updated.
        </>
      )}
    </div>
  );
}
