const router = require("express").Router();
const { isAdmin, userVerification } = require("../middlewares/AuthMiddleWare");
const {
  AddIngredients,
  ShowAllIngredients,
  GetIngredientsDetail,
  UpdateIngredientsDetails,
  DeleteIngridient,
  CustomizedPizza,
} = require("../controllers/CustomizedPizzasController");

router.post("/customizepizza", userVerification, CustomizedPizza);
router.post("/addingredient", isAdmin, AddIngredients);
router.get("/allingridients", ShowAllIngredients);
router.get("/updateingridient/:id", isAdmin, GetIngredientsDetail);
router.put("/updateingridient/:id", isAdmin, UpdateIngredientsDetails);
router.delete("/deleteingridient/:id", isAdmin, DeleteIngridient);

module.exports = router;
