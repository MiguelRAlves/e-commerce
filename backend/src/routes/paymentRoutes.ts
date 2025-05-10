import { Router } from "express";
import { createCheckoutSessionController } from "../controllers/PaymentControllers/createCheckoutSessionController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateUser);

router.post("/create-checkout-session/:orderId", createCheckoutSessionController);

export default router;
