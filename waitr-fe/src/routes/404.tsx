import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  component: NotFoundComponent,
});

function NotFoundComponent() {
  // Allow users to go back using the browser's back button
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div
      className="not-found-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "0 20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          padding: "40px",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{ fontSize: "4rem", marginBottom: "1rem", color: "#dc3545" }}
        >
          404
        </h1>
        <h2 style={{ marginBottom: "1.5rem", color: "#343a40" }}>
          Page Not Found
        </h2>
        <p style={{ marginBottom: "2rem", color: "#6c757d" }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <button
            onClick={handleGoBack}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Go Back
          </button>
          <Link
            to="/"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
