const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const ensureDataFileExits = require("./middlewares/ensureDataFileExists");

const app = express();

require("dotenv").config();

app.set("view engine", "ejs");
// 템플릿 파일 경로를 "views" 라는 키에 저장
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const userRoutes = require("./routes/user");
const memoRoutes = require("./routes/memos");

app.use("/users", userRoutes);
app.use("/memos", memoRoutes);

// 404 오류 처리 미들웨어
app.use((req, res, next) => {
    res.status(404).send("Page not found");
});

// 500 오류 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

app.listen(process.env.PORT, () => 
    console.log(`Server running on port ${process.env.PORT}`)
);
