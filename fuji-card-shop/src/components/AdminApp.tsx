"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

type AdminProduct = {
  id: string;
  catalog: "fuji" | "apex";
  slug: string;
  name: string;
  price: number;
  image?: string;
  visible: boolean;
  status: string;
  stock?: number;
  category: string;
};

type Counts = {
  total: number;
  fuji: number;
  apex: number;
  withImage: number;
  hidden: number;
};

function readCsrf(): string {
  if (typeof document === "undefined") {
    return "";
  }
  const match = /(?:^|;\s*)fuji_admin_csrf=([^;]+)/.exec(document.cookie);
  return match ? decodeURIComponent(match[1]) : "";
}

export function AdminApp({ configured }: { configured: boolean }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [filter, setFilter] = useState<"all" | "fuji" | "apex">("all");
  const [query, setQuery] = useState("");
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    const res = await fetch("/api/admin/session", { credentials: "same-origin" });
    const json = (await res.json()) as {
      success: boolean;
      data?: { authenticated: boolean };
    };
    setAuthenticated(Boolean(json.data?.authenticated));
    return Boolean(json.data?.authenticated);
  }, []);

  const loadProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products", { credentials: "same-origin" });
    if (res.status === 401) {
      setAuthenticated(false);
      setProducts([]);
      return;
    }
    const json = (await res.json()) as {
      success: boolean;
      data?: { products: AdminProduct[]; counts: Counts };
      error?: string;
    };
    if (!json.success || !json.data) {
      setError(json.error || "Failed to load products");
      return;
    }
    setProducts(json.data.products);
    setCounts(json.data.counts);
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const ok = await refreshSession();
        if (!cancelled && ok) {
          await loadProducts();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Session check failed");
          setAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadProducts, refreshSession]);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setError(null);
    await refreshSession();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, csrfToken: readCsrf() }),
    });
    const json = (await res.json()) as { success: boolean; error?: string };
    if (!json.success) {
      setError(json.error || "Login failed");
      return;
    }
    setPassword("");
    setAuthenticated(true);
    await refreshSession();
    await loadProducts();
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    setAuthenticated(false);
    setProducts([]);
    setCounts(null);
    await refreshSession();
  }

  async function saveProduct(product: AdminProduct, patch: Partial<AdminProduct>) {
    setSavingSlug(product.slug);
    setError(null);
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        catalog: product.catalog,
        slug: product.slug,
        name: patch.name,
        price: patch.price,
        image: patch.image,
        visible: patch.visible,
        status: patch.status,
        stock: patch.stock,
        csrfToken: readCsrf(),
      }),
    });
    const json = (await res.json()) as {
      success: boolean;
      data?: { product: AdminProduct };
      error?: string;
    };
    setSavingSlug(null);
    if (!json.success || !json.data) {
      setError(json.error || "Save failed");
      return;
    }
    setProducts((prev) =>
      prev.map((item) => (item.id === json.data?.product.id ? json.data.product : item)),
    );
  }

  const visible = useMemo(() => {
    return products.filter((product) => {
      if (filter !== "all" && product.catalog !== filter) {
        return false;
      }
      if (!query.trim()) {
        return true;
      }
      const q = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    });
  }, [filter, products, query]);

  if (loading) {
    return <div className="panel">Checking session…</div>;
  }

  if (!authenticated) {
    return (
      <form className="panel admin-login" onSubmit={onLogin}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Admin login</h2>
        <p style={{ color: "var(--mist)", marginBottom: "1rem" }}>
          Session cookie is HttpOnly + SameSite=Strict. Login is rate-limited.
        </p>
        {!configured ? (
          <p className="stub-note">Auth env vars missing — login disabled.</p>
        ) : (
          <>
            <label className="admin-label">
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error ? <p className="admin-error">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={!configured}>
              Sign in
            </button>
          </>
        )}
      </form>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-toolbar">
        <div className="admin-stats">
          {counts ? (
            <>
              <span>{counts.total} SKUs</span>
              <span>{counts.withImage} with images</span>
              <span>{counts.fuji} Fuji</span>
              <span>{counts.apex} Apex</span>
              <span>{counts.hidden} hidden</span>
            </>
          ) : null}
        </div>
        <button type="button" className="btn btn-secondary" onClick={onLogout}>
          Sign out
        </button>
      </div>

      <div className="admin-filters">
        {(["all", "fuji", "apex"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className="chip"
            aria-current={filter === value ? "page" : undefined}
            onClick={() => setFilter(value)}
          >
            {value}
          </button>
        ))}
        <input
          className="admin-search"
          placeholder="Search name, slug, category"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Visible</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <AdminRow
                key={product.id}
                product={product}
                saving={savingSlug === product.slug}
                onSave={saveProduct}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminRow({
  product,
  saving,
  onSave,
}: {
  product: AdminProduct;
  saving: boolean;
  onSave: (product: AdminProduct, patch: Partial<AdminProduct>) => Promise<void>;
}) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [image, setImage] = useState(product.image || "");
  const [status, setStatus] = useState(product.status);
  const [stock, setStock] = useState(product.stock == null ? "" : String(product.stock));
  const [visible, setVisible] = useState(product.visible);

  useEffect(() => {
    setName(product.name);
    setPrice(String(product.price));
    setImage(product.image || "");
    setStatus(product.status);
    setStock(product.stock == null ? "" : String(product.stock));
    setVisible(product.visible);
  }, [product]);

  return (
    <tr>
      <td>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="admin-thumb" />
        ) : (
          <span className="admin-thumb placeholder">—</span>
        )}
      </td>
      <td>
        <div className="admin-catalog-tag">{product.catalog}</div>
        <input value={name} onChange={(event) => setName(event.target.value)} />
        <div className="admin-slug">{product.slug}</div>
        <input
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="/images/..."
        />
      </td>
      <td>
        <input
          value={price}
          inputMode="decimal"
          onChange={(event) => setPrice(event.target.value)}
        />
      </td>
      <td>
        <input value={status} onChange={(event) => setStatus(event.target.value)} />
      </td>
      <td>
        <input value={stock} inputMode="numeric" onChange={(event) => setStock(event.target.value)} />
      </td>
      <td>
        <input
          type="checkbox"
          checked={visible}
          onChange={(event) => setVisible(event.target.checked)}
        />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-primary"
          disabled={saving}
          onClick={() =>
            onSave(product, {
              name,
              price: Number(price),
              image: image || undefined,
              status,
              stock: stock === "" ? undefined : Number(stock),
              visible,
            })
          }
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </td>
    </tr>
  );
}
