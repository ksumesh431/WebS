const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");

function createDir(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }
}

module.exports = {
    fs, path, request, cheerio, createDir
}