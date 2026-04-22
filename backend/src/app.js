import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import expenseRoutes from "./routes/expenseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import budgetRoutes from "./routes/budgetRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  //production
  origin: process.env.CLIENT_URL ,
  credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/expenses", authMiddleware, expenseRoutes);
app.use("/categories", authMiddleware, categoryRoutes);
app.use("/budgets", authMiddleware, budgetRoutes);

export default app;
