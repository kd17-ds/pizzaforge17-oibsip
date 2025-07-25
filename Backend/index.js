// Load environment variables from .env (only in dev mode)
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

app.use(express.static(path.join(__dirname, "client", "dist"))); // Serve frontend static files (like React build)
app.set("trust proxy", 1); // For trusting proxies (like when deployed on Render, Vercel, etc.)

// Handle CORS – allows frontend (from another origin) to connect to backend
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
app.use("/", authRoute);
app.use("/pizzas", pizzaRoute);
app.use("/customized-pizzas", customizedPizzasRoute);
app.use("/orders", orderRoute);

main()
  .then((res) => {
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
