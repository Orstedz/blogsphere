import { v4 as uuidv4 } from "uuid"
import { getPool } from "../config/database.js"
import sql from "mssql"

export async function getUsers(req, res) {
  try {
    const pool = getPool()
    const result = await pool.request().query(`
        SELECT 
          u.id, u.username, u.email, u.role_id, r.name as role_name,
          u.created_at, u.updated_at, u.deleted_at
        FROM Users u
        LEFT JOIN Roles r ON u.role_id = r.id
        WHERE u.deleted_at IS NULL
        ORDER BY u.created_at DESC
      `)

    res.json({
      success: true,
      data: result.recordset,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    })
  }
}

export async function createUser(req, res) {
  try {
    const { username, email, password, role_id } = req.validated
    const userId = uuidv4()
    const pool = getPool()

    await pool
      .request()
      .input("id", sql.NVarChar, userId)
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .input("role_id", sql.NVarChar, role_id || null)
      .query(`
        INSERT INTO Users (id, username, email, password, role_id)
        VALUES (@id, @username, @email, @password, @role_id)
      `)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: userId },
    })
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    })
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params
    const { username, email, password, role_id } = req.validated
    const pool = getPool()

    const fields = []
    const request = pool.request()

    request.input("id", sql.NVarChar, id)

    if (username !== undefined) {
      fields.push("username = @username")
      request.input("username", sql.NVarChar, username)
    }
    if (email !== undefined) {
      fields.push("email = @email")
      request.input("email", sql.NVarChar, email)
    }
    if (password !== undefined) {
      fields.push("password = @password")
      request.input("password", sql.NVarChar, password)
    }
    if (role_id !== undefined) {
      fields.push("role_id = @role_id")
      request.input("role_id", sql.NVarChar, role_id)
    }

    fields.push("updated_at = GETUTCDATE()")

    await request.query(`
      UPDATE Users
      SET ${fields.join(", ")}
      WHERE id = @id
    `)

    res.json({
      success: true,
      message: "User updated successfully",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    })
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params
    const pool = getPool()

    await pool
      .request()
      .input("id", sql.NVarChar, id)
      .query(`
        UPDATE Users
        SET deleted_at = GETUTCDATE()
        WHERE id = @id
      `)

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    })
  }
}
