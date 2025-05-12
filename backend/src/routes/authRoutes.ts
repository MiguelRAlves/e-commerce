import { Router } from "express";
import { signInController, signUpController, logoutController } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/logout", authenticateUser, logoutController);

export default router;