function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: color || "#2563eb",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "220px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>

      <h1
        style={{
          marginTop: "15px",
          fontSize: "32px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Card;