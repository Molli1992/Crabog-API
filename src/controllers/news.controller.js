import { pool } from "../db.js";

// ---------------------------------------- get news ------------------------------------------

export const getNews = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM news");

    res.status(202).json({ message: "Exito trayendo noticias", news: rows });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- post news ------------------------------------------

export const postNews = async (req, res) => {
  try {
    const { date, type, seen } = req.body;
    const title = decodeURIComponent(req.body.title);
    const description = decodeURIComponent(req.body.description);

    if (!title || !description || !date || !type || seen === undefined) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [existingNews] = await pool.query(
      "SELECT * FROM news WHERE title = ?",
      [title]
    );

    if (existingNews.length > 0) {
      return res
        .status(404)
        .send({ message: "Ya existe una noticia con el mismo título" });
    }

    const [result] = await pool.query(
      "INSERT INTO news (title, description, date, type, seen) VALUES (?, ?, ?, ?, ?)",
      [title, description, date, type, seen]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Error al agregar la noticia" });
    }

    const [newNews] = await pool.query("SELECT * FROM news WHERE id = ?", [
      result.insertId,
    ]);

    res
      .status(201)
      .json({ message: "Noticia agregada exitosamente", news: newNews[0] });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- put news ------------------------------------------

export const putNews = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return res
        .status(404)
        .send({ message: "Falta enviar datos obligatorios" });
    }

    const [existingType] = await pool.query("SELECT * FROM news WHERE id = ?", [
      id,
    ]);

    if (existingType.length === 0) {
      return res.status(404).send({ message: "Noticia no encontrada" });
    }

    const [updateResult] = await pool.query(
      "UPDATE news SET name = ? WHERE id = ?",
      [name, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).send({ message: "Error modificando noticia" });
    }

    const [updatedType] = await pool.query("SELECT * FROM news WHERE id = ?", [
      id,
    ]);

    res.status(200).json({
      message: "Noticia modificada correctamente",
      type: updatedType[0],
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- delete news ------------------------------------------

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(404)
        .send({ message: "Falta enviar datos obligatorios" });
    }

    const [existingNews] = await pool.query("SELECT * FROM news WHERE id = ?", [
      id,
    ]);

    if (existingNews.length === 0) {
      return res.status(404).send({ message: "Noticia no encontrada" });
    }

    const [deleteResult] = await pool.query("DELETE FROM news WHERE id = ?", [
      id,
    ]);

    if (deleteResult.affectedRows === 0) {
      return res.status(400).send({ message: "Error eliminando noticia" });
    }

    res.status(200).send({ message: "Noticia eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};
