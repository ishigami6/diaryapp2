const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const Thread = require("./models/Thread");
const User = require("./models/User");

const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

//ログイン
// GETメソッド - ログインページを表示する
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// POSTメソッド - ログイン処理を実行する
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ユーザー名とパスワードを検証する処理をここに追加
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }

    // ログインに成功した場合は、ユーザー情報を返す
    res.status(200).json({ message: "Login successful", user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GETメソッド
app.get("/api/v1/threads", async (req, res) => {
    try {
      const userId = req.query.userId;
      let allThreads;
      if (userId) {
        allThreads = await Thread.find({ userId: userId });
      } else {
        allThreads = await Thread.find({});
      }
      res.status(200).json(allThreads);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  });

// POSTメソッド
app.post("/api/v1/threads", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const thread = new Thread({
      title: title,
      content: content,
      userId: userId,
    });

    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => console.log("Server is running on port " + PORT));


