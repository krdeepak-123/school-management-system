export default function Navbar() {
  return (
    <div style={styles.navbar}>
      <div>
        <h2 style={styles.title}>Paradise kids School Management System</h2>
        <p style={styles.subtitle}>Admin or principal Dashboard</p>
      </div>

      <div style={styles.user}>
        <div style={styles.avatar}>A</div>

        <div>
          <strong>Admin</strong>
          <br />
          <small>Administrator</small>
        </div>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: "70px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    color: "#1e293b",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
};