import type { ReactNode } from "react";

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-banner" role="status">
      {children ?? (
        <>
          <strong>Demo storefront</strong> — no live payments, emails, or inventory updates.
          Charges stay on the live Fuji Card Shop.
        </>
      )}
    </div>
  );
}
