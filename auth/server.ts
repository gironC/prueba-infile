import 'dotenv/config';
import { buildApp } from './app.js';
import { env } from './src/config/env.js';

const start = async () => {
  const app = await buildApp(env);
  try {
    await app.listen({port: env.PORT, host: '0.0.0.0'});
    console.log(`Server is running on port ${env.PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();