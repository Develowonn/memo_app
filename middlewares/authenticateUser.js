const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(403).render("unauthorized");
    }

    // 토큰 유효성 검사
    // decoded는 토큰을 만들 때 토큰 안에 저장해둔 데이터
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err){
            return res.status(403).send("Inavalid token");
        }
        console.log("decoded: " + decoded.userId);
        req.userId = decoded.userId; // 요청 객체에 사용자 ID 저장
        next();
    });
};

module.exports = authenticateUser;