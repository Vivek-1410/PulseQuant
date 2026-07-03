function Header({ loading }) {
  return (
    <header
      style={{
        padding: "16px 24px",
        backgroundColor: "#181A20",
        borderBottom: "1px solid #2B3139",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "20px",
          color: "#FCD535"
        }}
      >
        ⚡ PulseQuant Dashboard
      </h1>

      {loading && (
        <span
          style={{
            color: "#FCD535",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          Connecting to market...
        </span>
      )}
    </header>
  );
}

export default Header;