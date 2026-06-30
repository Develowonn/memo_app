const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const ensureDataFileExists = require("../middlewares/ensureDataFileExists");

const authenticateUser = require("../middlewares/authenticateUser");

// Json 파일을 저장할 경로 설정
const DATA_FILE = path.join(__dirname, "..", "data", "memos.json");

router.use(ensureDataFileExists("data/memos.json"));

router.get("/", (req, res) => {
    const memos = JSON.parse(fs.readFileSync(DATA_FILE));
    const searchQuery = req.query.search;
    
    let filteredMemos = memos;

    if (searchQuery) {
        filteredMemos = memos.filter(
            (memo) =>
                memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                memo.content.toLowerCase().includes(searchQuery.toLowerCase())
        ); 
    }

    const authError = req.query.authError === "true";

    res.render("memos/index", {
        memos: filteredMemos,
        authError: authError,
    });
});

router.get("/add", (req, res) => {
    res.render("memos/add");
});

router.post("/add", authenticateUser, (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId;
    console.log("user ID: " + userId);
    const memos = JSON.parse(fs.readFileSync(DATA_FILE));

    // 요청한 사용자가 로그인한 사용자인지 확인
    if(userId){
        memos.push({ id: uuidv4(), title, content, userId });
        fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));
        res.redirect("/memos");
    } else {
        return res.status(403).render("unauthorized");
    }
});

router.get("/edit/:id", authenticateUser, (req, res) => { 
    const memos = JSON.parse(fs.readFileSync(DATA_FILE));
    const memoIndex = memos.findIndex((m) => m.id === req.params.id);

    if(memoIndex !== -1 && memos[memoIndex].userId === req.userId) {
        res.render("memos/edit", { memo: memos[memoIndex] });
    } else {
        if (memoIndex >= 0) {
            res.redirect("/memos?authError=true");
        } else {
            return res.status(403).render("notfound");            
        }
    }
});

router.post("/edit/:id", authenticateUser, (req, res) => { 
    const { title, content } = req.body;
    const userId = req.userId;
    let memos = JSON.parse(fs.readFileSync(DATA_FILE));

    const index = memos.findIndex(
        (m) => m.id === req.params.id && m.userId === userId
    );

    if (index !== -1) {
        memos[index] = { ...memos[index], title, content };
        fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));
        res.redirect("/memos");
    } else {
        res.redirect("/memos?authError=true");
    }
});

router.post("/delete/:id", authenticateUser, (req, res) => {
    let memos = JSON.parse(fs.readFileSync(DATA_FILE));
    const memoIndex = memos.findIndex((m) => m.id === req.params.id);

    if(memoIndex !== -1 && memos[memoIndex].userId === req.userId) {
        memos.splice(memoIndex, 1);
        fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));
        res.redirect("/memos");
    } else {
        res.redirect("/memos?authError=true");
    }
});

module.exports = router;