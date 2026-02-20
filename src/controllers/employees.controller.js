import XLSX from "xlsx";
import fs from "fs";
import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const disciplineId = req.query.discipline_id; // para filtrar por disciplina

    let query = `
      SELECT e.*, d.name AS discipline_name
      FROM employees e
      JOIN disciplines d ON e.discipline_id = d.id
    `;
    const values = [];

    if (disciplineId) {
      query += " WHERE discipline_id = $1";
      values.push(disciplineId);
    }

    query += " ORDER BY e.id ASC";

    const response = await pool.query(query, values);
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los empleados",
      error: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const response = await pool.query(
      "SELECT e.*, d.name AS discipline_name FROM employees e JOIN disciplines d ON e.discipline_id = d.id WHERE e.id = $1",
      [id],
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.status(200).json(response.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el empleado",
      error: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, document, email, role, skills, discipline_id } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO employees 
        (name, document, email, role, skills, discipline_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, document, email, role, skills, discipline_id],
    );

    res.status(201).json({
      message: "Empleado creado correctamente",
      employee: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el empleado",
      error: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, document, email, role, skills, discipline_id, status } =
      req.body;

    const { rows, rowCount } = await pool.query(
      `UPDATE employees
       SET name=$1, document=$2, email=$3, role=$4, skills=$5, discipline_id=$6, status=$7
       WHERE id=$8
       RETURNING *`,
      [name, document, email, role, skills, discipline_id, status, id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.status(200).json({
      message: "Empleado actualizado correctamente",
      employee: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el empleado",
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { rowCount } = await pool.query(
      "DELETE FROM employees WHERE id = $1",
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.status(200).json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el empleado",
      error: error.message,
    });
  }
};

export const importEmployeesExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    // Leer archivo Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir hoja a JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Mapear columnas en español a inglés
    const employeesData = rawData.map((emp) => ({
      name: emp.nombre,
      document: emp.cedula,
      email: emp.correo,
      role: emp.rol || "",
      skills: emp.habilidades || "",
      discipline_id: emp.disciplina_id,
    }));

    const insertedEmployees = [];
    const skippedEmployees = [];

    for (const emp of employeesData) {
      const { name, document, email, role, skills, discipline_id } = emp;

      // Validación mínima
      if (!name || !document || !email || !discipline_id) {
        skippedEmployees.push({ ...emp, reason: "Faltan campos obligatorios" });
        continue;
      }

      // Verificar duplicados en la base de datos
      const existing = await pool.query(
        "SELECT id FROM employees WHERE document=$1 OR email=$2",
        [document, email],
      );

      if (existing.rows.length > 0) {
        skippedEmployees.push({
          ...emp,
          reason: "Documento o correo duplicado",
        });
        continue;
      }

      // Insertar en la base de datos
      const { rows } = await pool.query(
        `INSERT INTO employees 
         (name, document, email, role, skills, discipline_id)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [name, document, email, role, skills, discipline_id],
      );

      insertedEmployees.push(rows[0]);
    }

    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: `${insertedEmployees.length} empleados importados correctamente`,
      inserted: insertedEmployees,
      skipped: skippedEmployees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al importar empleados desde Excel",
      error: error.message,
    });
  }
};
