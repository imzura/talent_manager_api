import { pool } from "../db.js";

export const getDisciplines = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT * FROM disciplines ORDER BY id ASC",
    );
    res.status(200).json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener disciplinas", error: error.message });
  }
};

export const getDisciplineById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const response = await pool.query(
      "SELECT * FROM disciplines WHERE id = $1",
      [id],
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Disciplina no encontrada" });
    }

    res.status(200).json(response.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la disciplina",
      error: error.message,
    });
  }
};

export const createDiscipline = async (req, res) => {
  try {
    const { name, description } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO disciplines (name, description) VALUES ($1, $2) RETURNING *",
      [name, description],
    );

    res.status(201).json({
      message: "Disciplina creada correctamente",
      discipline: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la disciplina",
      error: error.message,
    });
  }
};

export const updateDiscipline = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, status } = req.body;

    // Si intentan desactivar, verificar que no tenga empleados activos asociados
    if (status === false) {
      const { rows: employees } = await pool.query(
        "SELECT id FROM employees WHERE discipline_id = $1 AND status = true LIMIT 1",
        [id],
      );

      if (employees.length > 0) {
        return res.status(400).json({
          message:
            "No se puede desactivar la disciplina porque tiene empleados activos asociados. Reasigna o desactiva primero esos empleados.",
        });
      }
    }

    const { rows, rowCount } = await pool.query(
      `UPDATE disciplines
       SET name = $1, description = $2, status = $3
       WHERE id = $4
       RETURNING *`,
      [name, description, status, id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Disciplina no encontrada" });
    }

    res.status(200).json({
      message: "Disciplina actualizada correctamente",
      discipline: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la disciplina",
      error: error.message,
    });
  }
};

export const deleteDiscipline = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rowCount } = await pool.query(
      "DELETE FROM disciplines WHERE id = $1",
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Disciplina no encontrada" });
    }

    res.status(200).json({ message: "Disciplina eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la disciplina",
      error: error.message,
    });
  }
};
