import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { connectToDatabase, closeConnection } from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { swaggerSpec } from "./config/swagger.js";
import categoriesRouter from "./routes/categories.js";
import postsRouter from "./routes/posts.js";
import seriesRouter from "./routes/series.js";
import usersRouter from "./routes/users.js";
import rolesRouter from "./routes/roles.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation - No CSP for Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "BlogSphere API Documentation",
  })
);

// Apply Helmet after Swagger to avoid CSP blocking Swagger UI
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// API Routes
app.use("/api/categories", categoriesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/series", seriesRouter);
app.use("/api/users", usersRouter);
app.use("/api/roles", rolesRouter);

app.get("/", (req, res) => {
  res.json({ message: "BlogSphere API is running", version: "1.0.0" });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await closeConnection();
  process.exit(0);
});

startServer();
