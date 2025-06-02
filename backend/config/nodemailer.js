import nodemailer from "nodemailer";
// Looking to send emails in production? Check out our Email API/SMTP product!
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
