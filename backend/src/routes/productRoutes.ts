import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { verifyIfUserIsAdmin } from "../middlewares/isAdminAuthMiddleware";

import { getProductsController } from "../controllers/ProductControllers/getProductsController";
import { getProductsByIdController } from "../controllers/ProductControllers/getProductsByIdController";
import { createProductController } from "../controllers/ProductControllers/createProductController";
import { updateProductController } from "../controllers/ProductControllers/updateProductController";
import { deleteProductController } from "../controllers/ProductControllers/deleteProductController";

const router = Router();

router.use(authenticateUser)

router.get("/products", getProductsController);
router.get("/products/:id", getProductsByIdController);

router.post("/products", verifyIfUserIsAdmin, createProductController);
router.put("/products/:id", verifyIfUserIsAdmin, updateProductController);
router.delete("/products/:id", verifyIfUserIsAdmin, deleteProductController);

export default router;