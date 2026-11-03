import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page not found · Shubh Biodata",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafaf9",
          color: "#1c1917",
          margin: 0,
        }}
      >
        <main style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "3rem", margin: 0 }}>॥</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            404 — Page not found
          </h1>
          <p style={{ color: "#78716c" }}>
            The page you are looking for does not exist.
          </p>
          <a
            href="./en/"
            style={{ color: "#c2410c", textDecoration: "underline" }}
          >
            Go to Shubh Biodata
          </a>
        </main>
      </body>
    </html>
  );
}
