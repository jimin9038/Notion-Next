import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & { db?: PrismaClient };
  if (!globalWithPrisma.db) {
    globalWithPrisma.db = new PrismaClient();
  }
  db = globalWithPrisma.db;
}

export default db;
