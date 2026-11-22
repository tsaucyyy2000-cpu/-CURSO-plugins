import type { ReactNode } from "react";

export function StickyCtaBar({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`sticky-cta-bar ${className}`.trim()}>{children}</div>;
}
