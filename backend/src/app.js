import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/expenses", expenseRoutes);
app.use("/categories", categoryRoutes);

export default app;