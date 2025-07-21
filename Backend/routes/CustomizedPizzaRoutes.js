const router = require("express").Router();
const { isAdmin } = require("../middlewares/AuthMiddleWare");
const {
  AddIngredients,
  ShowAllIngredients,
  GetIngredientsDetail,
  UpdateIngredientsDetails,
  DeleteIngridient,
} = require("../controllers/CustomizedPizzasController");

router.post("/addingredient", isAdmin, AddIngredients);
router.get("/allingridients", isAdmin, ShowAllIngredients);
router.get("/updateingridient/:id", isAdmin, GetIngredientsDetail);
router.put("/updateingridient/:id", isAdmin, UpdateIngredientsDetails);
router.delete("/deleteingridient/:id", isAdmin, DeleteIngridient);

module.exports = router;
