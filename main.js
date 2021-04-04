const { fs, path, request, cheerio, createDir } = require("./includes");
const { makeTeams } = require("./modules/makeTeams");
const { processMatches } = require("./modules/processMatches")

createDir("IPL 2020");

let teamspageUrl = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/points-table-standings";
makeTeams(teamspageUrl);

let matchesPageURL = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";
processMatches(matchesPageURL);
