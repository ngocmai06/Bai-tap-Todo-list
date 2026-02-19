const express = require("express");
const Task = require("./models/Task");
const connectDB = require("./config/db.js");
connectDB();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));  

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const tasks = await Task.find();

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total ? (done / total) * 100 : 0;

  res.render("index", { tasks, percent });
});

app.post("/add-task", async (req, res) => {
  const newTask = new Task({
    title: req.body.title,
    done: false
  });

  await newTask.save();
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.post("/done/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    done: true,
    doneAt: new Date()
  });
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
