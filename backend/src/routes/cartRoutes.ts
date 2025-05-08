import { Router } from "express";

import { getUserCartItemsController } from "../controllers/CartControllers/getUserCartItemsController";
import { addItemToCartController } from "../controllers/CartControllers/addItemToCartController";
import { updateCartItemQuantityController } from "../controllers/CartControllers/updateCartItemQuantityController";
import { removeItemFromCartController } from "../controllers/CartControllers/removeItemFromCartController";
import { clearUserCartController } from "../controllers/CartControllers/clearUserCartController";

import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateUser);

router.get("/", getUserCartItemsController);
router.post("/:productId", addItemToCartController);
router.put("/:productId", updateCartItemQuantityController);
router.delete("/:productId", removeItemFromCartController);
router.delete("/", clearUserCartController);

export default router;