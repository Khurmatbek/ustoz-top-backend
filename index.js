import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { PrismaClient } from "@prisma/client";

import authRoutes from "./src/routes/auth.js";
import teacherRoutes from "./src/routes/teacher.js";
import { swaggerDocs } from "./src/swagger.js";

const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth",authRoutes);
app.use("/api/teachers",teacherRoutes);


app.get("/", (req, res) => {
  res.send("Ustoz Top Backend ishlayapti!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  swaggerDocs(app,PORT);
  console.log(`Server ${PORT} portda ishlayapti`);
});
