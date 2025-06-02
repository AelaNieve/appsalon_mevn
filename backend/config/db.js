import mongoose from "mongoose";
import colors from "colors";

// Función asíncrona para conectar a la base de datos
export const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // Usamos 'conn' para la conexión, 'db' ya es el nombre de la función
    const url = `${conn.connection.host}:${conn.connection.port}`;
    console.log(
      colors.magenta.italic(
        `🌸 ¡Yay! Conectado a la base de datos con éxito en: ${url} 🎀`
      )
    );
  } catch (error) {
    console.log(
      colors.red.bgBlack.bold(
        `💔 ¡Oh, no! Hubo un error al conectar: ${error.message} 😭`
      )
    );
    process.exit(1); // Cortamos la ejecución si no hay BD, ¡esencial pa' vivir!
  }
};
