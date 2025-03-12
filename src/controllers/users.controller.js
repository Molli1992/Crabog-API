import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// ---------------------------------------- get All Users ------------------------------------------

export const getAllUser = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");

    res.status(202).json({ message: "Exito trayendo usuarios", news: rows });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- get User ------------------------------------------

export const getUser = async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const email = decodeURIComponent(req.params.email);

    if (!id || !email) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [user] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR id = ?",
      [email, id]
    );

    if (user.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.status(202).json({ message: "Exito trayendo usuario" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- login User ------------------------------------------

export const loginUser = async (req, res) => {
  try {
    const email = decodeURIComponent(req.body.email);
    const password = decodeURIComponent(req.body.password);

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (user.isActive === 0) {
      return res.status(401).json({ message: "Usuario inactivo" });
    }

    res.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive === 0 ? false : true,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- post User ------------------------------------------

export const postUser = async (req, res) => {
  try {
    const email = decodeURIComponent(req.body.email);
    const password = decodeURIComponent(req.body.password);
    const name = decodeURIComponent(req.body.name);

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [existingUserEmail] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUserEmail.length > 0) {
      return res
        .status(404)
        .send({ message: "Ya existe un usuario con el mismo email" });
    }

    const [existingUserName] = await pool.query(
      "SELECT * FROM users WHERE name = ?",
      [name]
    );

    if (existingUserName.length > 0) {
      return res
        .status(404)
        .send({ message: "Ya existe un usuario con el mismo nombre" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = uuidv4();

    const [result] = await pool.query(
      "INSERT INTO users (id, name, email, password, isActive) VALUES (?, ?, ?, ?, ?)",
      [id, name, email, hashedPassword, false]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Error al crear usuario" });
    }

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- put User ------------------------------------------

export const putUser = async (req, res) => {
  try {
    const { id, email, name, isActive } = req.body;

    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).send({ message: "Usuario inexistente" });
    }

    let updateQuery = "UPDATE users SET";
    const updateValues = [];

    if (name) {
      updateQuery += " name = ?";
      updateValues.push(name);
    }

    if (email) {
      if (updateValues.length > 0) updateQuery += ",";
      updateQuery += " email = ?";
      updateValues.push(email);
    }

    if (isActive !== undefined) {
      if (updateValues.length > 0) updateQuery += ",";
      updateQuery += " isActive = ?";
      updateValues.push(isActive);
    }

    if (updateValues.length === 0) {
      res
        .status(400)
        .send({ message: "No se han proporcionado datos para actualizar" });
    }

    updateQuery += " WHERE id = ?";
    updateValues.push(id);

    const [updateResult] = await pool.query(updateQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      return res.status(400).send({ message: "Error modificando usuario" });
    }

    const [updatedUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);

    res.status(200).send({
      message: "Usuario actualizado exitosamente",
      user: {
        id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        isActive: updatedUser[0].isActive === 0 ? false : true,
      },
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al actualizar el usuario", error: error });
  }
};

// ---------------------------------------- delete User ------------------------------------------

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(404)
        .send({ message: "Falta enviar datos obligatorios" });
    }

    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const [deleteResult] = await pool.query("DELETE FROM users WHERE id = ?", [
      id,
    ]);

    if (deleteResult.affectedRows === 0) {
      return res.status(400).send({ message: "Error eliminando usuario" });
    }

    res.status(200).send({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};

// ---------------------------------------- reset Password ------------------------------------------

export const resetPassword = async (req, res) => {
  try {
    const email = decodeURIComponent(req.body.email);
    const password = decodeURIComponent(req.body.password);

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length === 0) {
      return res.status(404).send({ message: "Usuario inexistente" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [updateResult] = await pool.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).send({ message: "Error modificando contraseña" });
    }

    res.status(200).json({
      message: "Contraseña modificada correctamente",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error });
  }
};
