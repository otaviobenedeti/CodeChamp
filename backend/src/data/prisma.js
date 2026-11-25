require("dotenv/config");

const fs = require("node:fs");
const path = require("node:path");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const certificado = fs.readFileSync(
  path.resolve(__dirname, "../../certs/supabase-prod-ca.crt"),
  "utf8"
);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: certificado,
    rejectUnauthorized: true
  }
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;