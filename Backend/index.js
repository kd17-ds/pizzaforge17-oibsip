if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URL;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/AuthRoutes");
const pizzaRoute = require("./routes/PizzasRoutes");
const orderRoute = require("./routes/OrderRoutes");
const customizedPizzasRoute = require("./routes/CustomizedPizzaRoutes");

app.use(express.static(path.join(__dirname, "client", "dist")));
app.set("trust proxy", 1); // For trusting proxies (Render, Vercel, etc.)

// CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", authRoute);
app.use("/api/pizzas", pizzaRoute);
app.use("/api/customized-pizzas", customizedPizzasRoute);
app.use("/api/orders", orderRoute);

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

main()
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
