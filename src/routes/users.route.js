import { Router } from "express";
import {
  getAllUser,
  loginUser,
  postUser,
  putUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/getAllUser", getAllUser);
router.post("/loginUser", loginUser);
router.post("/post", postUser);
router.put("/put", putUser);
router.delete("/delete", deleteUser);

export default router;
