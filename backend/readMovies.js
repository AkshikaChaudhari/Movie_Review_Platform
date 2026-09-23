const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "movie.json");

const data = fs.readFileSync(filePath, "utf-8");

const movie = JSON.parse(data);

console.log(movie);