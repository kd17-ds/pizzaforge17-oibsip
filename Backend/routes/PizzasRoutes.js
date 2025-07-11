const router = require("express").Router();
const {
  AddPizza,
  GetPizzaDetails,
  DeletePizza,
  UpdatePizzaDetails,
} = require("../controllers/PizzasControllers");
const { isAdmin } = require("../middlewares/AuthMiddleWare");

router.post("/addpizza", isAdmin, AddPizza);
router.get("/updatepizza/:id", isAdmin, GetPizzaDetails);
router.put("/updatepizza/:id", isAdmin, UpdatePizzaDetails);
router.delete("/deletepizza/:id", isAdmin, DeletePizza);

module.exports = router;
