const express = require("express");
const connectDB = require("./config/db.js");
connectDB();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
