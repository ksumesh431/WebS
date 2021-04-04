const { fs, path, request, cheerio, createDir } = require("../includes");
const { processPlayers } = require("./processPlayers");

function processMatches(url) {
    request(url, (err, res, html) => {
        if (err) {
            console.log(err);
        }
        else {
            let selTool = cheerio.load(html);
            let linksArr = selTool("a[data-hover='Scorecard']");
            for (let i = 0; i < linksArr.length; i++) {
                let pLink = selTool(linksArr[i]).attr("href");
                let fullLink = "https://www.espncricinfo.com" + pLink;
                // console.log(fullLink);
                processPlayers(fullLink);
            }
        }
    })
}

module.exports = {
    processMatches
}
