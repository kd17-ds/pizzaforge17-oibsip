const router = require("express").Router();
const {
  AddPizza,
  GetPizzaDetails,
  DeletePizza,
  UpdatePizzaDetails,
  ShowAllPizzas,
} = require("../controllers/PizzasControllers");
const { isAdmin } = require("../middlewares/AuthMiddleWare");

router.post("/addpizza", isAdmin, AddPizza);
router.get("/updatepizza/:id", isAdmin, GetPizzaDetails);
router.put("/updatepizza/:id", isAdmin, UpdatePizzaDetails);
router.delete("/deletepizza/:id", isAdmin, DeletePizza);
router.get("/showallpizzas", ShowAllPizzas);

module.exports = router;
