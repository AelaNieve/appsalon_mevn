import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

db();

const whitelist =
  process.argv[2] == "--postman"
    ? [process.env.FRONTEND_URL, undefined]
    : [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Pinche cors pendejo"));
    }
  },
};
app.use(cors(corsOptions));

app.use("/api/services", servicesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.clear();
  console.log(colors.black.bgWhite.dim("Server starting in port :", PORT));
});
