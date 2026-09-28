import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pdfRoutes from "./routes/routers.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", pdfRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PDF server is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PDF server running on port ${PORT}`);
});