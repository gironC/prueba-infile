import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyToken(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch(err) {
    return reply.code(401).send({error: 'Token invalid'});
  }
}