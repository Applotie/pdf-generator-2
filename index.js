import "dotenv/config";
import express from 'express';
import cors from 'cors';

import pdfRoutes from './routes/routers.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/pdf", pdfRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {});