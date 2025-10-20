import express from "express";
import { registerUser, verifyCode, getSessionUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyCode);
router.get("/session", getSessionUser);

export default router;
