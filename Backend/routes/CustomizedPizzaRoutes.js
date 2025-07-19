const router = require("express").Router();
const { isAdmin } = require("../middlewares/AuthMiddleWare");
const {
  UpdateInventory,
} = require("../controllers/CustomizedPizzasController");

router.post("/updateInventory", isAdmin, UpdateInventory);

module.exports = router;
