const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://127.0.0.1:27017/todo_db")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const User = require("./models/User");
const Task = require("./models/Task");

async function seedData() {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});

    const admin = await User.create({
      username: "admin",
      password: await bcrypt.hash("123", 10),
      fullName: "Admin",
      role: "admin"
    });

    const user1 = await User.create({
      username: "a01",
      password: await bcrypt.hash("123456", 10),
      fullName: "Nguyễn Văn A"
    });

    const user2 = await User.create({
      username: "b02",
      password: await bcrypt.hash("123456", 10),
      fullName: "Trần Văn B"
    });

    const user3 = await User.create({
      username: "c03",
      password: await bcrypt.hash("123456", 10),
      fullName: "Nguyễn Thị H"
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await Task.create([
      {
        title: "Làm bài MongoDB",
        description: "Hoàn thành Level 1",
        userId: user1._id,
        done: true,
        doneAt: new Date()
      },
      {
        title: "Học NodeJS",
        description: "Ôn Express",
        userId: user1._id,
        done: false
      },
      {
        title: "Làm bài tập JS Core",
        description: "Nộp trước thứ 6",
        userId: user3._id,
        done: false
      },
      {
        title: "Review code",
        description: "Fix bug API",
        userId: user2._id,
        done: true,
        doneAt: yesterday,
        createdAt: yesterday
      }
    ]);

    console.log("Seed data inserted successfully!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

seedData();

