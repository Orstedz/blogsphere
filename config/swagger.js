import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BlogSphere API Documentation",
      version: "1.0.0",
      description:
        "A comprehensive REST API for the BlogSphere blogging platform. Manage posts, categories, series, users, and roles with full CRUD operations.",
      contact: {
        name: "BlogSphere Team",
        url: "https://github.com/blogsphere",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.blogsphere.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Categories",
        description: "Content categorization endpoints",
      },
      {
        name: "Posts",
        description: "Blog post management endpoints",
      },
      {
        name: "Series",
        description: "Content series management endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Roles",
        description: "Role and permissions management endpoints",
      },
    ],
    components: {
      schemas: {
        Category: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            name: {
              type: "string",
              description: "Category name",
              example: "Technology",
            },
            description: {
              type: "string",
              nullable: true,
              description: "Category description",
              example: "Articles about technology and innovation",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Post: {
          type: "object",
          required: ["title", "content"],
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            title: {
              type: "string",
              description: "Post title",
              example: "Getting Started with React",
            },
            content: {
              type: "string",
              description: "Post content body",
              example:
                "React is a JavaScript library for building user interfaces...",
            },
            category_id: {
              type: "integer",
              nullable: true,
              description: "Associated category ID",
              example: 1,
            },
            series_id: {
              type: "integer",
              nullable: true,
              description: "Associated series ID",
              example: 1,
            },
            author_id: {
              type: "integer",
              description: "Author user ID",
              example: 1,
            },
            status: {
              type: "string",
              enum: ["Draft", "Published", "Archived"],
              description: "Post publication status",
              example: "Published",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Series: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            name: {
              type: "string",
              description: "Series name",
              example: "React Fundamentals",
            },
            description: {
              type: "string",
              nullable: true,
              description: "Series description",
              example: "A comprehensive guide to React basics",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            username: {
              type: "string",
              description: "Username",
              example: "johndoe",
            },
            email: {
              type: "string",
              description: "Email address",
              example: "john@example.com",
            },
            password: {
              type: "string",
              description: "User password (hashed in storage)",
              example: "SecurePass123!",
            },
            role_id: {
              type: "integer",
              nullable: true,
              description: "Assigned role ID",
              example: 1,
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Role: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            name: {
              type: "string",
              description: "Role name",
              example: "Administrator",
            },
            description: {
              type: "string",
              nullable: true,
              description: "Role description",
              example: "Full system access and management",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              description: "Response data",
            },
            message: {
              type: "string",
              description: "Success message",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Error message",
              example: "An error occurred",
            },
            error: {
              type: "string",
              description: "Detailed error information",
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./server.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
