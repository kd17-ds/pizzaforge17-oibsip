const router = require("express").Router();
const { userVerification, isAdmin } = require("../middlewares/AuthMiddleWare");
const {
  CreateOrder,
  GetUserOrders,
  GetOrderById,
} = require("../controllers/OrderController");

router.post("/create", userVerification, CreateOrder);
router.get("/myorders", userVerification, GetUserOrders);
router.get("/order/:id", userVerification, GetOrderById);

module.exports = router;
