"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, navLinks } from "@/data/content";
import { useCart } from "@/lib/cart";
import { CurrencyToggle } from "@/lib/currency-display";

function navCurrent(pathname: string, href: string): boolean {
  // Query-string presets (e.g. Yu-Gi-Oh lane) are not path-current markers.
  if (href.includes("?")) {
    return false;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={`${brand.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand-logo"
            src="/brand/fuji-card-logo.png"
            alt=""
            width={36}
            height={36}
          />
          <div>
            <div className="brand-mark">
              Fuji <span>Card</span>
            </div>
            <div className="brand-sub">Based in Japan · Sealed TCG</div>
          </div>
        </Link>
        <nav className="nav" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={navCurrent(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="cart-pill">
            Cart {hydrated ? itemCount : 0}
          </Link>
        </nav>
      </div>
      <div className="shell header-tools">
        <CurrencyToggle />
      </div>
      <div className="shell mobile-nav" aria-label="Mobile">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <Link href="/cart">Cart {hydrated ? itemCount : 0}</Link>
      </div>
    </header>
  );
}
