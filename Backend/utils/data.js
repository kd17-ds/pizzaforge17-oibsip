const pizzaData = [
  {
    name: "Margherita",
    category: "Veg",
    availability: true,
    description: "Classic delight with 100% real mozzarella cheese",
    image_url:
      "https://static.toiimg.com/thumb/53110049.cms?width=1200&height=900",
    prices: {
      small: 149,
      medium: 199,
      large: 249,
    },
  },
  {
    name: "Farmhouse",
    category: "Veg",
    availability: true,
    description:
      "Delightful combination of onion, capsicum, tomato & grilled mushroom",
    image_url: "https://www.dominos.co.in/files/items/Farmhouse.jpg",
    prices: {
      small: 199,
      medium: 269,
      large: 329,
    },
  },
  {
    name: "Peppy Paneer",
    category: "Veg",
    availability: true,
    description:
      "Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika",
    image_url: "https://www.dominos.co.in/files/items/Peppy_Paneer.jpg",
    prices: {
      small: 199,
      medium: 279,
      large: 349,
    },
  },
  {
    name: "Chicken Dominator",
    category: "Non-Veg",
    availability: true,
    description:
      "Loaded with double pepper barbecue chicken, peri-peri chicken, grilled chicken rashers and chicken tikka",
    image_url: "https://www.dominos.co.in/files/items/Chicken_Dominator.jpg",
    prices: {
      small: 249,
      medium: 329,
      large: 399,
    },
  },
  {
    name: "Non Veg Supreme",
    category: "Non-Veg",
    availability: true,
    description:
      "Supreme combination of black olives, onion, capsicum, grilled mushroom, pepper barbeque chicken, peri-peri chicken",
    image_url: "https://www.dominos.co.in/files/items/Non-Veg_Supreme.jpg",
    prices: {
      small: 259,
      medium: 339,
      large: 419,
    },
  },
  {
    name: "Indi Chicken Tikka",
    category: "Non-Veg",
    availability: true,
    description:
      "The wholesome flavour of tandoori masala with Chicken tikka, onion, red paprika & mint mayo",
    image_url: "https://www.dominos.co.in/files/items/IndiChickenTikka.jpg",
    prices: {
      small: 229,
      medium: 309,
      large: 389,
    },
  },
  {
    name: "Mexican Green Wave",
    category: "Veg",
    availability: true,
    description: "Mexican herbs with onion, capsicum, tomato & jalapeno.",
    image_url: "https://www.dominos.co.in/files/items/Mexican_Green_Wave.jpg",
    prices: {
      small: 149,
      medium: 269,
      large: 389,
    },
  },
  {
    name: "Cheese n Corn",
    category: "Veg",
    availability: true,
    description: "Cheese lovers' paradise with golden corn and cheese.",
    image_url: "https://www.dominos.co.in/files/items/Cheese_n_Corn.jpg",
    prices: {
      small: 129,
      medium: 249,
      large: 349,
    },
  },
  {
    name: "Veg Extravaganza",
    category: "Veg",
    availability: true,
    description: "Loaded with onion, capsicum, olives, corn, and more.",
    image_url: "https://www.dominos.co.in/files/items/Veg_Extravaganza.jpg",
    prices: {
      small: 189,
      medium: 319,
      large: 459,
    },
  },
  {
    name: "Chicken Golden Delight",
    category: "Non-Veg",
    availability: true,
    description: "Barbecue chicken with golden corn and extra cheese.",
    image_url:
      "https://www.dominos.co.in/files/items/Chicken_Golden_Delight.jpg",
    prices: {
      small: 169,
      medium: 299,
      large: 429,
    },
  },
  {
    name: "Chicken Dominator",
    category: "Non-Veg",
    availability: true,
    description: "Loaded with spicy chicken, tikka & grilled chicken rashers.",
    image_url: "https://www.dominos.co.in/files/items/Chicken_Dominator.jpg",
    prices: {
      small: 189,
      medium: 329,
      large: 479,
    },
  },
  {
    name: "Pepper Barbecue Chicken",
    category: "Non-Veg",
    availability: true,
    description: "A classic favorite with barbecue-flavored chicken chunks.",
    image_url:
      "https://www.dominos.co.in/files/items/Pepper_Barbeque_&_Onion.jpg",
    prices: {
      small: 149,
      medium: 269,
      large: 399,
    },
  },
];

module.exports = { pizzaData };

const bases = [
  { name: "Thin Crust", price: 100, availableQty: 20 },
  { name: "Hand Tossed", price: 120, availableQty: 20 },
  { name: "Cheese Burst", price: 150, availableQty: 20 },
  { name: "Whole Wheat", price: 130, availableQty: 20 },
  { name: "Gluten-Free", price: 140, availableQty: 20 },
];

const sauces = [
  { name: "Classic Tomato", price: 20, availableQty: 50 },
  { name: "Spicy Peri Peri", price: 25, availableQty: 50 },
  { name: "Pesto Basil", price: 30, availableQty: 50 },
  { name: "Garlic Alfredo", price: 35, availableQty: 50 },
  { name: "Barbecue", price: 25, availableQty: 50 },
];

const cheeses = [
  { name: "Mozzarella", price: 40, availableQty: 40 },
  { name: "Cheddar", price: 50, availableQty: 40 },
  { name: "Parmesan", price: 60, availableQty: 40 },
  { name: "Vegan Cheese", price: 55, availableQty: 40 },
  { name: "Double Cheese Mix", price: 65, availableQty: 40 },
];

const veggies = [
  { name: "Onion", price: 10, availableQty: 100 },
  { name: "Tomato", price: 10, availableQty: 100 },
  { name: "Capsicum", price: 15, availableQty: 100 },
  { name: "Corn", price: 15, availableQty: 100 },
  { name: "Jalapeños", price: 20, availableQty: 100 },
  { name: "Olives", price: 20, availableQty: 100 },
  { name: "Mushrooms", price: 25, availableQty: 100 },
  { name: "Paneer", price: 30, availableQty: 100 },
  { name: "Spinach", price: 15, availableQty: 100 },
  { name: "Red Paprika", price: 20, availableQty: 100 },
];

module.exports = {
  bases,
  sauces,
  cheeses,
  veggies,
};
