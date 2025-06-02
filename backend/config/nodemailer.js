import nodemailer from "nodemailer";

// Esta función es como la fábrica de carteros, tu le dices donde y cómo, y ella te da el cartero.
export function createTransport(host, port, user, pass) {
  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });
}
