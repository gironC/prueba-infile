import type { FastifyInstance } from "fastify";
import { categorias, posts, post, relacionados, favoritos, arFavoritos } from "./post.service.js";
import { verifyToken } from "../../middleware/auth.js";

export default async function postsRouter(app: FastifyInstance) {
  app.get('/categorias', categorias);
  app.post('/posts', { preHandler: verifyToken }, posts);
  app.post('/post', { preHandler: verifyToken }, post);
  app.post('/relacionados', { preHandler: verifyToken }, relacionados);
  app.post('/favoritos', { preHandler: verifyToken }, favoritos);
  app.post('/arFavoritos', { preHandler: verifyToken }, arFavoritos);
}