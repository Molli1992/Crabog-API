import { Router } from "express";
import {
  emailResetPassword,
  contactEmail,
  lawyerEmail
} from "../controllers/emails.controller.js";

const router = Router();

router.post("/resetPassword", emailResetPassword);
router.post("/contactEmail", contactEmail);
router.post("/lawyerEmail", lawyerEmail);

export default router;
