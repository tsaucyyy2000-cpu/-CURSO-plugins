"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, navLinks } from "@/data/content";
import { useCart } from "@/lib/cart";

export function Header() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={`${brand.name} home`}>
          <div className="brand-mark">
            Fuji <span>Card</span> Shop
          </div>
          <div className="brand-sub">Based in Japan · Sealed TCG</div>
        </Link>
        <nav className="nav" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="cart-pill">
            Cart {hydrated ? itemCount : 0}
          </Link>
        </nav>
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
