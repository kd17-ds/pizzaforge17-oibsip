const router = require("express").Router();
const {
  AddPizza,
  GetPizzaDetails,
  DeletePizza,
  UpdatePizzaDetails,
} = require("../controllers/PizzasControllers");

router.post("/addpizza", AddPizza);
router.get("/updatepizza/:id", GetPizzaDetails);
router.put("/updatepizza/:id", UpdatePizzaDetails);
router.delete("/deletepizza/:id", DeletePizza);

module.exports = router;
