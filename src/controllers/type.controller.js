import { pool } from "../db.js";

// ---------------------------------------- get types ------------------------------------------

export const getTypes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM types");

    res.status(202).json({ message: "Exito trayendo generos", types: rows });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- post types ------------------------------------------

export const postTypes = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Falta enviar datos obligatorios" });
    }

    const [existingType] = await pool.query(
      "SELECT * FROM types WHERE name = ?",
      [name]
    );

    if (existingType.length > 0) {
      return res
        .status(404)
        .send({ message: "Ya existe un genero con el mismo nombre" });
    }

    const [result] = await pool.query("INSERT INTO types (name) VALUES (?)", [
      name,
    ]);

    if (result.affectedRows === 0) {
      res.status(400).json({ message: "Error al agregar el genero" });
    }

    const [newType] = await pool.query("SELECT * FROM types WHERE id = ?", [
      result.insertId,
    ]);

    res
      .status(201)
      .json({ message: "Genero agregado exitosamente", type: newType[0] });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- put types ------------------------------------------

export const putTypes = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return res
        .status(404)
        .send({ message: "Falta enviar datos obligatorios" });
    }

    const [existingType] = await pool.query(
      "SELECT * FROM types WHERE id = ?",
      [id]
    );

    if (existingType.length === 0) {
      return res.status(404).send({ message: "Genero no encontrado" });
    }

    const [updateResult] = await pool.query(
      "UPDATE types SET name = ? WHERE id = ?",
      [name, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).send({ message: "Error modificando genero" });
    }

    const [updatedType] = await pool.query("SELECT * FROM types WHERE id = ?", [
      id,
    ]);

    res.status(200).json({
      message: "Genero modificado correctamente",
      type: updatedType[0],
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- delete types ------------------------------------------

export const deleteTypes = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(404)
        .send({ message: "Falta enviar datos obligatorios" });
    }

    const [existingType] = await pool.query(
      "SELECT * FROM types WHERE id = ?",
      [id]
    );

    if (existingType.length === 0) {
      return res.status(404).send({ message: "Genero no encontrado" });
    }

    const [deleteResult] = await pool.query("DELETE FROM types WHERE id = ?", [
      id,
    ]);

    if (deleteResult.affectedRows === 0) {
      return res.status(400).send({ message: "Error eliminando genero" });
    }

    res.status(200).send({ message: "Genero eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};
