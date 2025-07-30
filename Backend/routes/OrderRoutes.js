const router = require("express").Router();
const { userVerification, isAdmin } = require("../middlewares/AuthMiddleWare");
const {
  GetUserOrders,
  GetOrderById,
  UpdateOrCreateCart,
  GetCart,
  GetAllOrders,
  UpdateOrderStatus,
  CreateRazorpayOrder,
  PlaceOrderAfterPayment,
  PlaceOrderCOD,
} = require("../controllers/OrderController");

router.get("/myorders", userVerification, GetUserOrders);
router.get("/order/:id", userVerification, GetOrderById);
router.put("/cart", userVerification, UpdateOrCreateCart);
router.get("/cart", userVerification, GetCart);
router.get("/allorders", isAdmin, GetAllOrders);
router.put("/:id/status", isAdmin, UpdateOrderStatus);
router.post("/cod/placeorder", userVerification, PlaceOrderCOD);
router.post("/razorpay", CreateRazorpayOrder);
router.post("/razorpay/placeorder", userVerification, PlaceOrderAfterPayment);

module.exports = router;
