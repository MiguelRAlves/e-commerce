import { Router } from "express";

import { createOrderFromCartController } from "../controllers/OrderControllers/createOrderFromCartController";
import { getUserOrdersController } from "../controllers/OrderControllers/getUserOrdersController";
import { getOrderDetailsController } from "../controllers/OrderControllers/getOrderDetailsController";
import { cancelOrderController } from "../controllers/OrderControllers/cancelOrderController";
import { getUserOrderHistoryController } from "../controllers/OrderControllers/getUserOrderHistoryController";

import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateUser);

router.post('/', createOrderFromCartController);
router.get('/', getUserOrdersController);
router.get('/my/history', getUserOrderHistoryController);
router.get('/:orderId', getOrderDetailsController)
router.patch('/:orderId/cancel', cancelOrderController);

export default router
