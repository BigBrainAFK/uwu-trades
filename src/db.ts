import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.PG_SSL_REQUIRED === "true"
      ? { rejectUnauthorized: false }
      : false,
});

export const Database = new PrismaClient({ adapter });
