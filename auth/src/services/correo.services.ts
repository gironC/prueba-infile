import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_KEY);

export async function enviarCorreoActivacion(para:string, codigo: string) {
  await resend.emails.send({
    from: 'Infile <no-reply@kinova.click>',
    to: para,
    subject: 'Activacion de cuenta',
    html: `
      <img src='https://infile.com/hs-fs/hubfs/0_Logo_Azul122.png?width=200&height=100&name=0_Logo_Azul122.png' />
      <h2>Bienvenido</h2>
      <p>Tu código es:</p>
      <h1>${codigo}</h1>
    `
  });
}

export async function enviarCorreoReset(para:string, codigo: string) {
  await resend.emails.send({
    from: 'Infile <no-reply@kinova.click>',
    to: para,
    subject: 'Reinicio de contraseña',
    html: `
      <img src='https://infile.com/hs-fs/hubfs/0_Logo_Azul122.png?width=200&height=100&name=0_Logo_Azul122.png' />
      <h2>Reinicio de contraseña</h2>
      <p>Tu código es:</p>
      <h1>${codigo}</h1>
    `
  });
}