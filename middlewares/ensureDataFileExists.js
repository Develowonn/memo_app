const fs = require("fs");
const path = require("path");

// 고착 함수
const ensureDataFileExists = (relativePath) => (req, res, next) => {
    const fullPath = path.join(__dirname, "..", relativePath);

    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, JSON.stringify([]), "utf-8");
    }

    next();
}

module.exports = ensureDataFileExists;