import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_API_URL as string,
    process.env.BETTER_AUTH_URL as string,
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Vercel + Render are different domains, not subdomains
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true, // required for sameSite: none, works on https (both Vercel/Render are https)
    },
  },
});
