const express = require("express");
const { connection } = require("./db/db");
const { userRouter } = require("./routes/user.routes");
const { productRouter } = require("./routes/products.routes");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/products", productRouter);
app.listen(4200, async () => {
  try {
    await connection;
    console.log("Database is connected");
    console.log("server started");
  } catch (error) {
    console.log(error.message);
  }
});
