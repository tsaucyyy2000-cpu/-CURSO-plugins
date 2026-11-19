import { AdminApp } from "@/components/AdminApp";
import { isAdminConfigured } from "@/lib/admin-auth";

export default function AdminPage() {
  const configured = isAdminConfigured();
  return (
    <div className="shell" style={{ padding: "2.5rem 0 4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Staff only</div>
        <h1>Catalog admin</h1>
        <p>
          Manage Fuji retail and Apex wholesale product names, prices, images, visibility, and stock
          flags. Storefront checkout remains stubbed — admin prices do not authorize payments.
        </p>
      </div>
      {!configured ? (
        <div className="stub-note" style={{ marginBottom: "1.5rem" }}>
          Set <code>ADMIN_PASSWORD_HASH</code> and <code>ADMIN_SESSION_SECRET</code> in the
          environment to enable login. See <code>.env.example</code>.
        </div>
      ) : null}
      <AdminApp configured={configured} />
    </div>
  );
}
