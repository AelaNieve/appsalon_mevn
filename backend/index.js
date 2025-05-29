import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

db();

app.use("/api/services", servicesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.clear();
  console.log(colors.black.bgWhite.dim("Server starting in port :", PORT));
});
