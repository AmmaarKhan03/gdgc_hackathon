import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import authRoutes from "./routes/auth";
import healthRoutes from "./routes/health";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: "http://localhost:5173", // your Vite frontend
        credentials: false,
    })
);

app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

async function start() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
