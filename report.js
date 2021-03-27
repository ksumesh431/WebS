let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let teamsurl = url + "/points-table-standings";

request(url, function cb(err, resp, html) {
    if (err) {
        console.log(err);
    } else {
        extractData(html);
    }
})
function extractData(html) {
    let selTool = cheerio.load(html);
    let squadLink = selTool("#__next > div:nth-child(2) > div > div > nav > div > div > ul > li:nth-child(6) > a").attr("href");//gives link of squad page;
    reqSquadsPage(squadLink);
    let resultsLink = selTool("#main-container > div:nth-child(1) > div.series-page-wrapper > div > div > div.col-16.col-md-16.col-lg-12.main-content-x > div > div.d-none.d-xl-block.col-xl-5 > div > div > ul > li > a").attr("href");
    let fullLink = "https://www.espncricinfo.com/" + resultsLink;
    requestResultsPage(fullLink);
}
//````````````````````````````````````````````````//

function reqSquadsPage(link) {
    request(link, function cb(err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            extractTeams(html);
        }
    })
}
function extractTeams(html) {
    let selTool = cheerio.load(html);
    let linksArr = selTool(".squads_list li span a[href]");
    for (let i = 0; i < linksArr.length; i++) {
        let link = selTool(linksArr[i]).attr("href");
        let teamName = selTool(linksArr[i]).text();
        if (i == 0) {
            let strArr = teamName.split("(");
            strArr.pop();
            let final = strArr.toString();
            teamName = final.replace(" ", "_").trim();
            teamName2 = teamName.replace(" ", "_").trim();
        } else {
            let strArr = teamName.split("Squad");
            strArr.pop();
            let final = strArr.toString();
            teamName = final.replace(" ", "_").trim();
            teamName2 = teamName.replace(" ", "_").trim();
            //  console.log(teamName2);
        }
        let fullLink = "https://www.espncricinfo.com/" + link;  //gives link of team page 
        getPlayersPage(fullLink, teamName2);

        //  console.log(teamName2, "=>", fullLink + "\n")
        makeFolder(teamName2);
    }
}
function makeFolder(name) {
    let folderPath = path.join(__dirname, name);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}
function fileCreator(topicName, fileName) {
    let filePath = path.join(__dirname, topicName, fileName + ".json");
    if (!fs.existsSync(filePath)) {
        fs.openSync(filePath, "w");  //open sync overwrites file if present..else creates empty file
    }
}

function getPlayersPage(link, teamName) {
    request(link, function cb(err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            makePlayerFiles(html, teamName);
        }
    })
}
function makePlayerFiles(html, teamName) {
    let selTool = cheerio.load(html);
    let nameArr = selTool(' div.large-13.medium-13.small-13.columns > h3 a');
    //  console.log(teamName,"===>")
    for (let i = 0; i < nameArr.length; i++) {
        let name = selTool(nameArr[i]).text();
        let nameWithoutSpaces = name.replace(" ", "_").trim()
        let nameWithoutSpaces2 = nameWithoutSpaces.replace(" ", "_").trim()
        fileCreator(teamName, nameWithoutSpaces2);
        //    console.log(nameWithoutSpaces2);
    }
    // console.log("````");
}
//````  Team folders and Player files made ``````````//


function requestResultsPage(link) {
    request(link, function cb(err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            getScorecardLinks(html);
        }
    })
}
function getScorecardLinks(html) {
    let selTool = cheerio.load(html);
    linksArr = selTool('.match-score-block a[data-hover="Scorecard"]');
    let lArr = [];
    for (let i = 0; i < linksArr.length; i++) {
        let link = selTool(linksArr[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com/" + link;
        lArr.push(fullLink);
    }
    requestMatchPage(lArr, 0);
}
function requestMatchPage(arr, idx) {
    if (idx == 20) {
        return;
    }
    request(arr[idx], function cb(err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            // console.log("THIS IS CALL FOR A Match ~~~~~>`")
            processMatch(html);
            requestMatchPage(arr, idx+1);   //fix serialwise async 
        }
    })
}
function processMatch(html) {
    let selTool = cheerio.load(html);
    //console.log("^^^^^^^^^^^^^^^^^ MUST PRINT AFTER EVERY MATCH ^^^^^^^^^^^^^^^^^^^^^^^")



    let team1a = selTool("#main-container > div.match-page-wrapper.scorecard-page-wrapper > div.container > div.row > div.col-16.col-md-16.col-lg-12.main-content-x > div.card > div.match-header > div.event > div > div > div.teams > div.team.team-gray > div.name-detail > a > p").text();
    let team1b = team1a.replace(" ", "_").trim();
    let team1final = team1b.replace(" ", "_").trim();

    let team2a = selTool("#main-container > div.match-page-wrapper.scorecard-page-wrapper > div.container > div.row > div.col-16.col-md-16.col-lg-12.main-content-x > div.card > div.match-header > div.event > div > div > div.teams > div:nth-child(2) > div.name-detail > a > p").text();
    let team2b = team2a.replace(" ", "_").trim();
    let team2final = team2b.replace(" ", "_").trim();
    //console.log(team2final);





    let BatsmanTable = selTool(".table.batsman");    //gets the two batsman tables
    for (let i = 0; i < BatsmanTable.length; i++) {
        let Team = "";    //NAME OF TEAMS
        let OppTeam = "";
        if (i == 0) {
            Team = team1final;
            OppTeam = team2final;
        } else {
            Team = team2final;
            OppTeam = team1final;
        }

        let fullRows = selTool(BatsmanTable[i]).find("tbody tr");

        for (let i = 0; i < fullRows.length; i += 2) { //every iteration =single player row
            let arr = [];
            let name = "";
            let colArr = selTool(fullRows[i]).find("td");
            let nameTest = selTool(colArr[0]).text();
            let runs = selTool(colArr[3]).text();
            let balls = selTool(colArr[4]).text();
            let four = selTool(colArr[5]).text();
            let six = selTool(colArr[6]).text();
            let srTest = selTool(colArr[7]).text();
            if (nameTest !== "Extras") {
                name = nameTest;

                //for removing † and (c) from names
                let strArr1 = name.split("†");
                if (strArr1[strArr1.length - 1] == "†") {
                    strArr1.pop();
                }
                let x = strArr1.join(" ");
                let strArr2 = x.split("(c)");
                let pName = strArr2.join(" ");
                //////////////////////////////////////

                pNameA = pName.replace(" ", "_").trim();
                pNameFinal = pNameA.replace(" ", "_").trim();  //NAMES OF PLAYERS

                arr.push({
                    "Runs": runs,
                    "Balls": balls,
                    "Sixes": six,
                    "Fours": four,
                    "SR": srTest,
                    "Opponent Name": OppTeam
                })

                let filePath = path.join(__dirname, Team, pNameFinal + ".json");
                fs.appendFileSync(filePath, JSON.stringify(arr));
                
            }
        }
        // console.log("``````````````")
    }
}