import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "BlogSphereDB",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    instanceName: process.env.DB_INSTANCE || undefined,
  },
};

let pool = null;

export async function connectToDatabase() {
  try {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log("Database connection established!");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
}

export function getPool() {
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.close();
    console.log("Database connection closed!");
  }
}
