const express = require("express");
const port = 3000;
const app = express();
const cors = require("cors");
const connectToMongoDB = require("./config/connect");
const mongoUrl = "mongodb://localhost:27017/Expense-Tracker";
const userRoute = require("./routes/user");
const expenseRoute = require('./routes/expense')

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/auth", userRoute);
app.use("/", expenseRoute)

//server setup
const startServer = async () => {
  try {
    //database connection
    await connectToMongoDB(mongoUrl);
    //server connection
    app.listen(port, () => {
      console.log(`Server successfully started at port: ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server due to MongoDB", error);
    process.exit(1);
  }
};

startServer();