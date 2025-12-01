import { getPool } from "../config/database.js";
import sql from "mssql";

/**
 * Base controller with common CRUD operations
 * Reduces code duplication across all controllers
 */
export class BaseController {
  constructor(tableName, resourceName) {
    this.tableName = tableName;
    this.resourceName = resourceName;
  }

  /**
   * Get all records
   */
  async getAll(req, res, customQuery = null) {
    try {
      const pool = getPool();
      const query =
        customQuery ||
        `
        SELECT * FROM ${this.tableName}
        ORDER BY created_at DESC
      `;
      const result = await pool.request().query(query);

      res.json({
        success: true,
        data: result.recordset,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error fetching ${this.resourceName}`,
        error: err.message,
      });
    }
  }

  /**
   * Create a new record
   */
  async create(req, res, fields) {
    try {
      const pool = getPool();
      const request = pool.request();

      const columns = [];
      const values = [];

      // Build dynamic query based on fields
      for (const [key, value] of Object.entries(fields)) {
        columns.push(key);
        values.push(`@${key}`);
        request.input(key, sql.NVarChar, value || null);
      }

      const result = await request.query(`
        INSERT INTO ${this.tableName} (${columns.join(", ")})
        OUTPUT INSERTED.id
        VALUES (${values.join(", ")})
      `);

      const newId = result.recordset[0].id;

      res.status(201).json({
        success: true,
        message: `${this.resourceName} created successfully`,
        data: { id: newId, ...fields },
      });
    } catch (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({
          success: false,
          message: `${this.resourceName} already exists`,
        });
      }
      res.status(500).json({
        success: false,
        message: `Error creating ${this.resourceName}`,
        error: err.message,
      });
    }
  }

  /**
   * Update a record by ID
   */
  async update(req, res, fields) {
    try {
      const { id } = req.params;
      const pool = getPool();
      const request = pool.request();

      const setClauses = [];
      request.input("id", sql.Int, id);

      // Build dynamic SET clause
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          setClauses.push(`${key} = @${key}`);
          request.input(key, sql.NVarChar, value);
        }
      }

      setClauses.push("updated_at = GETUTCDATE()");

      await request.query(`
        UPDATE ${this.tableName}
        SET ${setClauses.join(", ")}
        WHERE id = @id
      `);

      res.json({
        success: true,
        message: `${this.resourceName} updated successfully`,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error updating ${this.resourceName}`,
        error: err.message,
      });
    }
  }

  /**
   * Delete a record by ID
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const pool = getPool();

      await pool.request().input("id", sql.Int, id).query(`
        DELETE FROM ${this.tableName}
        WHERE id = @id
      `);

      res.json({
        success: true,
        message: `${this.resourceName} deleted successfully`,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error deleting ${this.resourceName}`,
        error: err.message,
      });
    }
  }

  /**
   * Get a single record by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pool = getPool();

      const result = await pool.request().input("id", sql.Int, id).query(`
        SELECT * FROM ${this.tableName}
        WHERE id = @id
      `);

      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: `${this.resourceName} not found`,
        });
      }

      res.json({
        success: true,
        data: result.recordset[0],
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error fetching ${this.resourceName}`,
        error: err.message,
      });
    }
  }
}
