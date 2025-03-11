import { Router } from "express";
import {
  getNews,
  putNews,
  deleteNews,
  postNews,
} from "../controllers/news.controller.js";

const router = Router();

router.get("/get", getNews);
router.post("/post", postNews);
router.put("/put", putNews);
router.delete("/delete", deleteNews);

export default router;
