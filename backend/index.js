// backend\index.js

import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Cargar las variables de entorno.
dotenv.config();

// Crear la app de Express. Si no, no funkara la API
const app = express();

// IMPORTANTE: configurando el express para que confie en el proxy
// Esta linea es utilizada para identificar el ip del cliente
app.set("trust proxy", 1);

// Permitir que Express lea JSON del body.
app.use(express.json());

// Conectar a la base de datos.
db();

// Configuración de CORS. esta me hizo sufrir
const whitelist = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];
if (process.argv[2] === "--postman" || process.env.NODE_ENV === "development") {
  // Permitir Postman/undefined origin en desarrollo
  whitelist.push(undefined); // Para permitir solicitudes de Postman que pueden tener origin undefined
}

const corsOptions = {
  origin: function (origin, callback) {
    // console.log('CORS Origin:', origin);
    if (
      whitelist.includes(origin) ||
      (!origin && whitelist.includes(undefined))
    ) {
      // !origin para el caso undefined
      callback(null, true);
    } else {
      // ¡Alto ahí! No estás en la lista.
      callback(
        new Error(
          "Error de CORS: Origen no permitido. Estabas intentando hackear el server?"
        )
      );
    }
  },
  credentials: true, // Para cookies o sesiones en el futuro
};
app.use(cors(corsOptions));

// Definir las rutas.
app.use("/api/services", servicesRoutes); // Rutas para todo lo relacionado con servicios
app.use("/api/auth", authRoutes); // Rutas para la autenticación y manejo de usuarios

// Puerto donde el servidor escuchará.
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // console.clear();
  console.log(
    colors.cyan.bold(
      `🚀 Servidor funcionando a toda máquina en el puerto ${colors.yellow.underline(
        PORT
      )}. ¡A codear se ha dicho!`
    )
  );
});
