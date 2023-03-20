const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const router = express.Router();

// ユーザー認証
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // ユーザー名が登録されているか確認
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりませんでした" });
    }

    // パスワードの一致確認
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "パスワードが違います" });
    }

    // JWTの生成
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "ログインに成功しました", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ログインに失敗しました" });
  }
});

// ユーザー認証の確認
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "認証に失敗しました" });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりませんでした" });
    }

    res.status(200).json({ message: "認証に成功しました", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "認証に失敗しました" });
  }
});

module.exports = router;
