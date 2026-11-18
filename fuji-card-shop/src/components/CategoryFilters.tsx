import Link from "next/link";
import { categories } from "@/data/products";

export function CategoryFilters({ active }: { active?: string }) {
  return (
    <div className="filters" aria-label="Categories">
      <Link href="/store" className="chip" aria-current={!active ? "page" : undefined}>
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={category.href}
          className="chip"
          aria-current={active === category.slug ? "page" : undefined}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
