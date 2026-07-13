export const env = {
  PORT: Number(process.env.PORT!),
  JWT_SECRET: process.env.JWT_SECRET!,
  CORS_DOMAINS: process.env.CORS_DOMAINS!,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES!
};