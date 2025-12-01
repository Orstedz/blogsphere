import { v4 as uuidv4 } from "uuid";
import { getPool } from "../config/database.js";
import sql from "mssql";

export async function getPosts(req, res) {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
        SELECT 
          p.id, p.title, p.content, p.category_id, c.name as category_name,
          p.series_id, s.name as series_name, p.author_id, u.username as author_name,
          p.status, p.created_at, p.updated_at, p.deleted_at
        FROM Posts p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN Series s ON p.series_id = s.id
        LEFT JOIN Users u ON p.author_id = u.id
        WHERE p.deleted_at IS NULL
        ORDER BY p.created_at DESC
      `);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: err.message,
    });
  }
}

export async function createPost(req, res) {
  try {
    const { title, content, category_id, series_id, status } = req.validated;
    const postId = uuidv4();
    const pool = getPool();

    // Get a default user ID from the database
    const userResult = await pool.request().query(`
      SELECT TOP 1 id FROM Users
    `);

    const defaultUserId = userResult.recordset[0]?.id || null;

    await pool
      .request()
      .input("id", sql.NVarChar, postId)
      .input("title", sql.NVarChar, title)
      .input("content", sql.NVarChar, content)
      .input("category_id", sql.NVarChar, category_id || null)
      .input("series_id", sql.NVarChar, series_id || null)
      .input("author_id", sql.NVarChar, defaultUserId)
      .input("status", sql.NVarChar, status || "Draft").query(`
        INSERT INTO Posts (id, title, content, category_id, series_id, author_id, status)
        VALUES (@id, @title, @content, @category_id, @series_id, @author_id, @status)
      `);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: { id: postId },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: err.message,
    });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content, category_id, series_id, status } = req.validated;
    const pool = getPool();

    const fields = [];
    const request = pool.request();

    request.input("id", sql.NVarChar, id);

    if (title !== undefined) {
      fields.push("title = @title");
      request.input("title", sql.NVarChar, title);
    }
    if (content !== undefined) {
      fields.push("content = @content");
      request.input("content", sql.NVarChar, content);
    }
    if (category_id !== undefined) {
      fields.push("category_id = @category_id");
      request.input("category_id", sql.NVarChar, category_id);
    }
    if (series_id !== undefined) {
      fields.push("series_id = @series_id");
      request.input("series_id", sql.NVarChar, series_id);
    }
    if (status !== undefined) {
      fields.push("status = @status");
      request.input("status", sql.NVarChar, status);
    }

    fields.push("updated_at = GETUTCDATE()");

    await request.query(`
      UPDATE Posts
      SET ${fields.join(", ")}
      WHERE id = @id
    `);

    res.json({
      success: true,
      message: "Post updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: err.message,
    });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const pool = getPool();

    await pool.request().input("id", sql.NVarChar, id).query(`
        UPDATE Posts
        SET deleted_at = GETUTCDATE()
        WHERE id = @id
      `);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: err.message,
    });
  }
}
