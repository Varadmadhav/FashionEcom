import { Router } from "express";
import { login, verifyAuth } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.get("/me", verifyAuth);

export default router;
