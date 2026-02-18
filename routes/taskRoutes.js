const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, description, userId } = req.body;
  const task = await Task.create({ title, description, userId });
  
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(tasks, null, 2));
});

router.get("/", async (req, res) => {
  const tasks = await Task.find().populate("userId", "username fullName");
  
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(tasks, null, 2));
});
router.get("/user/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.json([]);
  const tasks = await Task.find({ userId: user._id });
  
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(tasks, null, 2));
});

router.get("/today", async (req, res) => {
  const start = new Date();
  start.setHours(0,0,0,0);

  const end = new Date();
  end.setHours(23,59,59,999);

  const tasks = await Task.find({
    createdAt: { $gte: start, $lte: end }
  });

  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(tasks, null, 2));

});

router.get("/not-done", async (req, res) => {
  const tasks = await Task.find({ done: false });
  
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(tasks, null, 2));

});

router.get("/lastname/nguyen", async (req, res) => {
  const users = await User.find({
    fullName: { $regex: /^Nguyễn/i }
  });

  const userIds = users.map(u => u._id);

  const tasks = await Task.find({
    userId: { $in: userIds }
  }).populate("userId", "fullName");

  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(tasks, null, 2));

});

module.exports = router;

