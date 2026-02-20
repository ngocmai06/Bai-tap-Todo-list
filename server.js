const express = require("express");
const Task = require("./models/Task");
const User = require("./models/User");
const connectDB = require("./config/db.js");
const session = require("express-session");
connectDB();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));  

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.set("view engine", "ejs");

app.get("/", async (req, res) => {

  const tasks = await Task.find().populate("assignedUsers");
  const users = await User.find();

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total ? (done / total) * 100 : 0;

  res.render("index", {
    tasks,
    users,
    percent,
    currentUser: req.session.user
  });

});

app.post("/add-task", async (req, res) => {

  if (!req.session.user || req.session.user.role !== "admin") {
    return res.send("Bạn không có quyền phân task");
  }

  const newTask = new Task({
    title: req.body.title,
    description: req.body.description,
    assignedUsers: Array.isArray(req.body.assignedUsers)
      ? req.body.assignedUsers
      : [req.body.assignedUsers]
  });

  await newTask.save();
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.post("/done/:id", async (req, res) => {

  if (!req.session.user) {
    return res.send("Bạn chưa đăng nhập");
  }

  const task = await Task.findById(req.params.id);

  const currentUserId = req.session.user._id.toString();

  if (!task.completedUsers.map(id => id.toString()).includes(currentUserId)) {
    task.completedUsers.push(currentUserId);
    return res.send("Bạn không được phân task này");
  }

  if (task.completedUsers.length === task.assignedUsers.length) {
    task.done = true;
    task.doneAt = new Date();
  }

  await task.save();

  res.redirect("/");
});

app.get("/test-admin", async (req, res) => {
  const admin = await User.findOne({ username: "admin" });
  req.session.user = admin;
  res.send("Đã login admin");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
