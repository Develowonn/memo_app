const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const ensureDataFileExists = require("../middlewares/ensureDataFileExists");
require("dotenv").config();

// Json 파일을 저장할 경로 설정
const DATA_FILE = path.join(__dirname, "..", "data", "user.json");

// 데이터 파일이 존재하는지 확인하는 미들웨어 사용 
router.use(ensureDataFileExists("data/user.json"));

// 사용자 로그인 페이지 라우터
router.get("/login", (req, res) => {
    res.render("users/login");
}); 

// 사용자 로그인 처리 라우터
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(DATA_FILE));
    const user = users.find((u) => u.username === username);
    
    if(user && bcrypt.compareSync(password, user.password)){
        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET
        );
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/memos");
    } else {
        res.render("users/login", {
            error: "Invalid username or password",
        })
    }
});

// 사용자 로그아웃 처리 아우터
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/users/login");
});

// 사용자 등록 페이지 라우터
router.get("/register", (req, res) => {
    res.render("users/register");
}); 

// 사용자 등록 처리 라우터
router.post("/register", (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(DATA_FILE));
    const existingUser = users.find((u) => u.username === username);

    // 이미 존재하는 사용자인 경우
    if(existingUser) {
        return res.render("users/register", { error: "User already exists" });
    }

    // 새로운 사용자 추가 
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: uuidv4(),
        username: username,
        password: hashedPassword 
    }

    users.push(newUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

    res.redirect("/users/login");
});

module.exports = router;