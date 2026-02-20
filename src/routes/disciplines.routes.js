import { Router } from "express";
import { createDiscipline, deleteDiscipline, getDisciplineById, getDisciplines, updateDiscipline } from "../controllers/disciplines.controllers.js";

const router = Router();

router.get("/", getDisciplines);

router.get("/:id", getDisciplineById);

router.post("/", createDiscipline)

router.put("/:id", updateDiscipline);

router.delete("/:id", deleteDiscipline);


export default router;
