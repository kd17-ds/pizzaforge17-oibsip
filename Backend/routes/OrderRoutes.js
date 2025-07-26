const router = require("express").Router();
const { userVerification, isAdmin } = require("../middlewares/AuthMiddleWare");
const {
  CreateOrder,
  GetUserOrders,
  GetOrderById,
  UpdateOrCreateCart,
  GetCart,
} = require("../controllers/OrderController");

router.post("/create", userVerification, CreateOrder);
router.get("/myorders", userVerification, GetUserOrders);
router.get("/order/:id", userVerification, GetOrderById);
router.put("/cart", userVerification, UpdateOrCreateCart);
router.get("/cart", userVerification, GetCart);

module.exports = router;
