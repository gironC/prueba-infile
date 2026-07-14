import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import authRouter from './src/modules/auth/auth.routes.js';
import postsRouter from './src/modules/posts/post.route.js';

export async function buildApp(env: any) {
  const app = Fastify({logger: true});

  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  
  await app.register(cookie);

  await app.register(jwt, {
    secret: env.JWT_SECRET
  });

  await app.get('/health', async() => {
    console.log(env.CORS_DOMAINS.split(','));
    return {status: 'ok'};
  });

  await app.register(authRouter, {
    prefix: '/auth'
  });

  await app.register(postsRouter, {
    prefix: '/posts'
  });
  
  return app;
}