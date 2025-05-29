import mongoose from "mongoose";
import colors from "colors";

export const db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    const url = `${db.connection.host}:${db.connection.port}`;
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
    process.exit(1);
  }
};
