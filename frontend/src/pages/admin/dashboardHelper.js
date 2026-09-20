// =====================================
// DIRECTOR DASHBOARD HELPER STYLES
// Style slices used by the Director
// Dashboard — kept here to mirror the
// way every other role portal splits
// its dashboard into a small helper
// file (same patterns as the rest of
// the app).
// =====================================

export const statCard = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "16px",
    marginTop: "22px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "18px 16px",
    boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    transition: "transform .15s ease, box-shadow .15s ease",
  },
  icon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },
  number: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
  },
  title: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },
};

export const boxStyle = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "18px 20px",
  boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
  border: "1px solid #e2e8f0",
};

export const quickAction = {
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "10px 14px",
  textDecoration: "none",
  color: "#0f172a",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: 500,
  transition: "background .15s ease",
};

export const welcome = {
  background: "linear-gradient(135deg,#1e3a8a,#3b82f6)",
  borderRadius: "16px",
  color: "#ffffff",
  padding: "22px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  boxShadow: "0 8px 24px rgba(30,58,138,0.25)",
};

export const btnInline = {
  background: "#ffffff",
  color: "#1e3a8a",
  borderRadius: "10px",
  padding: "10px 16px",
  textDecoration: "none",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
};
