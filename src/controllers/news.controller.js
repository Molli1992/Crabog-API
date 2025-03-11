import { pool } from "../db.js";

// ---------------------------------------- get news ------------------------------------------

export const getNews = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM news");

    res.status(202).json({ news: rows });
  } catch (error) {
    res.status(404).send("Error interno del servidor:" + error);
  }
};
