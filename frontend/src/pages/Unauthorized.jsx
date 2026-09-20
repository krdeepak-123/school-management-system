import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f5f9",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 5px 15px rgba(0,0,0,.1)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "60px" }}>🚫</div>

        <h2 style={{ color: "#1e293b", margin: "10px 0" }}>
          Access Denied
        </h2>

        <p style={{ color: "#64748b", marginBottom: "25px" }}>
          You do not have permission to view this page.
        </p>

        <Link
          to="/"
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          ← Go to Dashboard
        </Link>
      </div>
    </div>
  );
}