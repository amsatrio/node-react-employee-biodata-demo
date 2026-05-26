import db from '../../config/db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// ==========================================
// 1. CREATE (Register / Add User)
// ==========================================
export const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Hash the password safely
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Default role to 1 if not explicitly provided
    const userRole = role !== undefined ? role : 1;

    const [result] = await db.query(
      `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
      [email, hashedPassword, userRole]
    );

    res.status(201).json({ 
      message: "User created successfully!", 
      userId: result.insertId 
    });
  } catch (error) {
    // Handle duplicate email error safely
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 2. READ (Get All Users or Single User)
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    // Never return passwords in select queries
    const [rows] = await db.query(`SELECT id, email, role FROM users`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT id, email, role FROM users WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 3. UPDATE (Modify User Details)
// ==========================================
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, role } = req.body;

    // First check if user exists
    const [userCheck] = await db.query(`SELECT id FROM users WHERE id = ?`, [id]);
    if (userCheck.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = [];
    const values = [];

    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (password) {
      updates.push("password = ?");
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      values.push(hashedPassword);
    }
    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    // Append ID to values array for the WHERE clause
    values.push(id);

    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email already taken" });
    }
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 4. DELETE (Remove User)
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};