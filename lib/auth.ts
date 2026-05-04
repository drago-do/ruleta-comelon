import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db, client } from "./db";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('Please add your BETTER_AUTH_SECRET to .env.local');
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error('Please add your BETTER_AUTH_URL to .env.local');
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Please add Google OAuth credentials to .env.local');
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  // Configuración de sesiones
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // Actualizar cada 24 horas
  },

  // Configuración de email verification (deshabilitado por ahora)
  emailAndPassword: {
    enabled: false,
  },
});

export type Session = typeof auth.$Infer.Session;
