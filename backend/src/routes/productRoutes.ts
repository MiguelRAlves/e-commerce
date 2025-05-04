import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { getProductsController } from "../controllers/productController";

const router = Router();

router.get("/products", authenticateUser, getProductsController);

export default router;