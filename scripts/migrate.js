import sql from "mssql";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  let dbPool = null;

  try {
    const dbName = process.env.DB_NAME || "BlogSphereDB";
    const dbConfig = {
      server: process.env.DB_SERVER || "localhost",
      database: dbName,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate:
          process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
        connectionTimeout: 30000,
        requestTimeout: 30000,
        enableArithAbort: true,
        instanceName: process.env.DB_INSTANCE || undefined,
      },
    };

    console.log(`Connecting to [${dbName}] database...`);
    dbPool = await sql.connect(dbConfig);
    console.log("Connected to database!");

    const schemaPath = path.join(__dirname, "../models/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Split by GO statement and execute each batch
    const batches = schema.split("GO").filter((batch) => batch.trim());

    console.log("Running schema migrations...");
    for (const batch of batches) {
      if (batch.trim()) {
        await dbPool.request().query(batch);
      }
    }

    console.log("Database migrations completed successfully!");
  } catch (err) {
    console.error("Migration error:", err.message);
    if (err.message.includes("Cannot open database")) {
      console.log("\nPlease create the database first by running:");
      console.log(
        "   scripts/setup-database.sql in SQL Server Management Studio"
      );
    }
    process.exit(1);
  } finally {
    if (dbPool) await dbPool.close();
  }
}

runMigrations();
