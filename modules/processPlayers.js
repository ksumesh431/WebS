const { fs, path, request, cheerio, createDir } = require("../includes");
const { addDataToPlayerFile } = require("./addDataToPlayerFile");

function processPlayers(url) {
    request(url, (err, res, html) => {
        if (err) {
            console.log(err);
        } else {
            let selTool = cheerio.load(html);
            let team1 = selTool("#main-container > div.match-page-wrapper.scorecard-page-wrapper > div.container > div.row > div.col-16.col-md-16.col-lg-12.main-content-x > div.card > div.match-header > div.event > div > div > div.teams > div:nth-child(1) > div.name-detail > a > p").text().trim()
            let team2 = selTool("#main-container > div.match-page-wrapper.scorecard-page-wrapper > div.container > div.row > div.col-16.col-md-16.col-lg-12.main-content-x > div.card > div.match-header > div.event > div > div > div.teams > div.team.team-gray > div.name-detail > a > p").text().trim();

            const dateandvenue = selTool(".match-info.match-info-MATCH .description").text().split(",")
            const date = dateandvenue[2].split("(")[0].trim()
            const venue = dateandvenue[1].trim()
            const result = selTool("#main-container > div.match-page-wrapper.scorecard-page-wrapper > div.container > div.row > div.col-16.col-md-16.col-lg-12.main-content-x > div.card > div.match-header > div.event > div > div > div.status-text > span").text().trim();

            let bothTeams = selTool(".match-scorecard-page .Collapsible");//both teams 
            for (let i = 0; i < bothTeams.length; i++) {
                let teamName = selTool(bothTeams[i]).find(".row.no-gutters.align-items-center h5.header-title.label").text().split("INNINGS")[0].trim();
                //console.log(teamName);
                let batsmenTablesRows = selTool(bothTeams[i]).find(".table.batsman tbody tr");
                for (let j = 0; j < batsmenTablesRows.length - 1; j += 2) {
                    let name = selTool(batsmenTablesRows[j]).find(".batsman-cell.text-truncate").text().trim();
                    const run = selTool(batsmenTablesRows[j]).find("td:nth-child(3)").text().trim();
                    const ball = selTool(batsmenTablesRows[j]).find("td:nth-child(4)").text().trim();
                    const fours = selTool(batsmenTablesRows[j]).find("td:nth-child(5)").text().trim();
                    const sixes = selTool(batsmenTablesRows[j]).find("td:nth-child(6)").text().trim();
                    const strikerate = selTool(batsmenTablesRows[j]).find("td:nth-child(7)").text().trim();
                    const opponent = i == 0 ? team2 : team1;
                    let batsmanObj = {
                        result,
                        name,
                        run,
                        ball,
                        fours,
                        sixes,
                        strikerate,
                        opponent,
                        date,
                        venue
                    }
                    addDataToPlayerFile(teamName, name, batsmanObj)


                    // console.log(matchObj);
                }

            }


        }
    })
}
// processPlayers("https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-royal-challengers-bangalore-25th-match-1216525/full-scorecard");

module.exports = {
    processPlayers
}
