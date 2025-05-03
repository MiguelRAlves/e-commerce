import { Router } from "express";
import { getProductsController } from "../controllers/productController";

const router = Router();

router.get("/products", getProductsController);

export default router;