import { Router } from "express";
import { getTypes } from "../controllers/type.controller.js";

const router = Router();

router.get("/get", getTypes);

export default router;
