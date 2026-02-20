import { Router } from "express";
import multer from "multer";
import { createEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee, importEmployeesExcel } from "../controllers/employees.controller.js";

const router = Router();

// Configuración de multer para guardar archivos temporalmente
const upload = multer({ dest: "uploads/" });

// Ruta para importar Excel
router.post("/import", upload.single("file"), importEmployeesExcel);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

router.post("/", createEmployee);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);


export default router;
