const styles = {
  heading: { marginBottom: "20px", color: "#1e293b" },
  sub: { color: "#64748b", marginTop: "-14px", marginBottom: "20px" },

  section: {
    background: "#fff",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 3px 10px rgba(0,0,0,.1)",
    marginTop: "24px",
    overflowX: "auto",
  },

  sectionTitle: { margin: "0 0 14px 0", color: "#1e293b" },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  empty: { color: "#64748b" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "18px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 3px 10px rgba(0,0,0,.1)",
    textAlign: "center",
  },

  icon: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "26px",
    margin: "auto",
  },

  number: { marginTop: "12px", color: "#1e293b" },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
    flexWrap: "wrap",
  },

  infoLabel: { color: "#64748b" },
  infoValue: { fontWeight: "bold", color: "#1e293b" },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginBottom: "14px",
    boxSizing: "border-box",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#334155",
    marginBottom: "6px",
  },

  btn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 22px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },

  btnSecondary: {
    background: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 22px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },

  btnDanger: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
  },

  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: "0 16px",
  },

  banner: {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontWeight: "bold",
  },

  errorBanner: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontWeight: "bold",
  },

  successBanner: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontWeight: "bold",
  },

  photoPreview: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #2563eb",
  },

  photoPlaceholder: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "36px",
    fontWeight: "bold",
  },
};

export default styles;
