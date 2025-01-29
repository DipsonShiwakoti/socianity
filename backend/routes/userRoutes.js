import express from "express";
const router = express.Router();
import {
  registerUser,
  authUser,
  logoutUser,
} from "../controllers/userController.js";

router.post("/", registerUser);
router.post("/login", authUser);
router.post("/logout", logoutUser);

export default router;
