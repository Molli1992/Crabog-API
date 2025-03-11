import { pool } from "../db.js";

// ---------------------------------------- get types ------------------------------------------

export const getTypes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM types");

    res.status(202).json({ types: rows });
  } catch (error) {
    res.status(404).send("Error interno del servidor:" + error);
  }
};
