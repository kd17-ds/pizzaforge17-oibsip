const router = require("express").Router();
const { userVerification, isAdmin } = require("../middlewares/AuthMiddleWare");
const {
  CreateOrder,
  GetUserOrders,
  GetOrderById,
  UpdateOrCreateCart,
  GetCart,
  GetAllOrders,
  UpdateOrderStatus,
  CreateRazorpayOrder,
  PlaceOrderAfterPayment,
} = require("../controllers/OrderController");

router.post("/create", userVerification, CreateOrder);
router.get("/myorders", userVerification, GetUserOrders);
router.get("/order/:id", userVerification, GetOrderById);
router.put("/cart", userVerification, UpdateOrCreateCart);
router.get("/cart", userVerification, GetCart);
router.get("/allorders", isAdmin, GetAllOrders);
router.put("/:id/status", isAdmin, UpdateOrderStatus);
router.post("/razorpay", CreateRazorpayOrder);
router.post("/razorpay/placeorder", userVerification, PlaceOrderAfterPayment);

module.exports = router;
