const { fs, path } = require("../includes");

function addDataToPlayerFile(teamName, name, matchobj) {
    let filePath = path.join(__dirname + "/../IPL 2020/" + teamName + "/" + name + ".json");
    if (fs.existsSync(filePath)) {
        let olddata = fs.readFileSync(filePath);  //this executes when file already there.. this stores the data in "olddata"
        olddata = JSON.parse(olddata);           //.parse changes the data present in string form to array of elements form
        olddata.push(matchobj); //adds matchObj data in old data
        fs.writeFileSync(filePath, JSON.stringify(olddata));  //writes "olddata" to file
    } else {
        let arr = [];
        arr.push(matchobj);
        fs.writeFileSync(filePath, JSON.stringify(arr));
    }
}

module.exports = {
    addDataToPlayerFile
}