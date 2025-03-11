import { Router } from "express";
import {
  getTypes,
  putTypes,
  deleteTypes,
  postTypes
} from "../controllers/type.controller.js";

const router = Router();

router.get("/get", getTypes);
router.post("/post", postTypes);
router.put("/put", putTypes);
router.delete("/delete", deleteTypes);

export default router;
