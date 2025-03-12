import { Router } from "express";
import { emailResetPassword } from "../controllers/emails.controller.js";

const router = Router();

router.post("/resetPassword", emailResetPassword);

export default router;
