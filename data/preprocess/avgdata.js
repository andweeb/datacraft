'use strict';
const fs = require('fs');

function getAverages(i) {
    let players = require(`../players/players${i}.json`);

    let list = {
         Kicks: [],
         BlockBreak: [],
         CraftedItems: [],
         BlockPlace: [],
         Logins: [],
         Death: [],
         Chat: [],
         KilledBy: [],
         Killed: []
    };

    for(let name in players) {
        let summary = players[name].summary;
        
        for(let action in summary) {
            list[action].push(summary[action]);
        }

        let killed = 0;
        for(let playerName in players[name].killed) {
          killed += players[name].killed[playerName];
        }

        list.Killed.push(killed);
    }

    let avg = {
        Kicks: list.Kicks.reduce((a, b) => a+b, 0) / list.Kicks.length || 0,
        BlockBreak: list.BlockBreak.reduce((a, b) => a+b, 0) / list.BlockBreak.length || 0,
        CraftedItems: list.CraftedItems.reduce((a, b) => a+b, 0) / list.CraftedItems.length || 0,
        BlockPlace: list.BlockPlace.reduce((a, b) => a+b, 0) / list.BlockPlace.length || 0,
        Logins: list.Logins.reduce((a, b) => a+b, 0) / list.Logins.length || 0,
        Death: list.Death.reduce((a, b) => a+b, 0) / list.Death.length || 0,
        Chat: list.Chat.reduce((a, b) => a+b, 0) / list.Chat.length || 0,
        KilledBy: list.KilledBy.reduce((a, b) => a+b, 0) / list.KilledBy.length || 0,
        Killed: list.Killed.reduce((a, b) => a+b, 0) / list.Killed.length
    };
    
    return avg;
}

let result = [];
for(let server = 1; server <= 14; server++) {
    console.log(`Getting server ${server} average stats...`);
    result.push(getAverages(server));
}
fs.writeFile(`avg.js`, JSON.stringify(result, null, 2));

console.log("Done :^)");
