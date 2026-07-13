import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

const allowedOrigins = String(process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      // Allow direct browser visits, Postman, curl, and health checks.
      if (!origin) return callback(null, true);

      // If CLIENT_ORIGINS is empty, allow all origins for this test app.
      if (allowedOrigins.length === 0) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      return callback(null, allowedOrigins.includes(normalizedOrigin));
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hostinger test backend is running.",
    health: "/api/health",
    test: "/api/test",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "Express is running successfully on Hostinger.",
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET request works.",
    query: req.query,
  });
});

app.post("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "POST request works.",
    received: req.body,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled request error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

const server = app.listen(PORT, HOST, () => {
  console.log("Hostinger test backend started successfully.");
  console.log(`Listening on http://${HOST}:${PORT}`);
  console.log(`NODE_ENV=${process.env.NODE_ENV || "development"}`);
  console.log(
    `CLIENT_ORIGINS=${allowedOrigins.length ? allowedOrigins.join(",") : "all origins allowed for testing"}`,
  );
});

server.on("error", (error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(() => process.exit(0));
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
