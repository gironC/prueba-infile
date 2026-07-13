import type { FastifyInstance } from "fastify";
import { login, loginBiometrico, loginGoogle, registro, registroGoogle, activarUsuario, reenviarActivacion, enviarReset, activarReset, refresh, perfil, existeUsuario, actualizarUsuario, cambiarPass } from "./auth.service.js";
import { verifyToken } from "../../middleware/auth.js";

export default async function authRouter(app: FastifyInstance) {
  app.post('/login', login);
  app.post('/loginBiometrico', loginBiometrico);
  app.post('/loginGoogle', loginGoogle);
  app.post('/registro', registro);
  app.post('/registroGoogle', registroGoogle);
  app.post('/activar', { preHandler: verifyToken }, activarUsuario);
  app.post('/reenviarActivacion', { preHandler: verifyToken }, reenviarActivacion);
  app.post('/enviarReset', enviarReset);
  app.post('/activarReset', activarReset);
  app.post('/refresh', refresh);
  app.get('/perfil', { preHandler: verifyToken }, perfil);
  app.post('/existe', existeUsuario);
  app.post('/actualizar', {preHandler: verifyToken}, actualizarUsuario);
  app.post('/cambiarPass', cambiarPass);
}