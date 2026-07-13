import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      correo: string;
      role: string;
    };

    user: {
      sub: string;
      correo: string;
      role: string;
    };
  }
}

export {};