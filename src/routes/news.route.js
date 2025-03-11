import { Router } from "express";
import { getNews } from "../controllers/news.controller.js";

const router = Router();

router.get("/get", getNews);

export default router;
