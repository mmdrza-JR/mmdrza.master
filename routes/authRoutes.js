import express from "express";
import {
  registerUser,
  verifyCode,
  getSessionUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyCode);
router.get("/session", getSessionUser);
router.post("/logout", logoutUser);

export default router;
