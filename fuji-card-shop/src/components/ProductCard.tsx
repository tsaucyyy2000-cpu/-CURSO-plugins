import Link from "next/link";
import { ProductArt } from "@/components/ProductArt";
import { formatPrice, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="product-tile">
      <ProductArt product={product} />
      <div className="product-meta">
        <h3>{product.name}</h3>
        <div className="price">{formatPrice(product)}</div>
      </div>
    </Link>
  );
}
