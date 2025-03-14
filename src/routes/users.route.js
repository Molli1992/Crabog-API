import { Router } from "express";
import {
  getAllUser,
  getUser,
  loginUser,
  postUser,
  putUser,
  resetPassword,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/getAllUser", getAllUser);
router.get("/getUser/:code/:email", getUser);

router.post("/loginUser", loginUser);
router.post("/post", postUser);

router.put("/put", putUser);
router.put("/resetPassword", resetPassword);

router.delete("/delete", deleteUser);

export default router;
