'use strict';
const fs = require('fs');

function getMaximums(i) {
    let players = require(`../players/players${i}.json`);
    let maximums = {
         Kicks: 0,
         BlockBreak: 0,
         CraftedItems: 0,
         BlockPlace: 0,
         Logins: 0,
         Death: 0,
         Chat: 0,
         KilledBy: 0,
         Killed: 0
    };

    for(let name in players) {
        let summary = players[name].summary;
        
        for(let action in summary) {
            if(maximums[action] < summary[action]) {
                maximums[action] = summary[action];
            }
        }

        let killed = 0;
        for(let playerName in players[name].killed) {
          killed += players[name].killed[playerName];
        }
        if(maximums.Killed < killed) {
            maximums.Killed = killed;
        }
    }
    
    return maximums;
}

let result = [];
for(let server = 1; server <= 14; server++) {
    console.log(`Getting server ${server} maximum stats...`);
    result.push(getMaximums(server));
}
fs.writeFile(`max.js`, JSON.stringify(result, null, 2));

console.log("Done :^)");
