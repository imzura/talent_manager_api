import { Router } from "express";
import routeDisciplines from "./disciplines.routes.js";
import routeEmployees from "./employees.routes.js";

const router = Router();

router.use('/disciplines', routeDisciplines);
router.use('/employees', routeEmployees);

export default router;