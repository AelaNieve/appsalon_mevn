import dotenv from "dotenv"; // Sin los corchetes por que causa problemas con el type module in package.json
import { db } from "../config/db.js";
import servicesModels from "../models/servicesModels.js";
import { services } from "./beautyServices.js";
import colors from "colors";

dotenv.config();
await db();

async function seedDB() {
  try {
    await servicesModels.insertMany(services);
    console.log(colors.bgGreen.bold("Base de datos importada correctamente"));
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function clearDB() {
  try {
    await servicesModels.deleteMany();
    console.log(colors.bgRed.bold("Se eliminó la base de datos correctamente"));
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

if (process.argv[2] == "--import") {
  seedDB();
} else {
  clearDB();
}
