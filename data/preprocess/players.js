'use strict';
const fs = require('fs');

function getStarData(players, i, stories) {
    let stats = {};

    for(let name in players) {
        let timesKilled = 0;
        let killedList = players[name].killed;
        let actions = players[name].actions;

        stats[name] = {};
        players[name].summary = {};

        for(let killed in killedList) {
            timesKilled += killedList[killed];
        }
        players[name].summary["Killed"] = timesKilled;
        
        for(let action in actions) {
            stats[name][action] = 0;
            players[name].summary[action] = 0;

            for(let type in actions[action]) {
                stats[name][action] += actions[action][type];
                players[name].summary[action] += actions[action][type];
            }
        }
    }

    // Write the result to a file
    fs.writeFile(`../players/players${i}.json`, JSON.stringify(players, null, 2));
    fs.writeFile(`../stories/stories${i}.json`, JSON.stringify(stories, null, 2));
}

function addToStories(stories, name, start_t, stop_t, player_b, interaction) {
    // Add to stories
    if(stories[name][start_t]) {
        stories[name][start_t].push({
            stop_t: stop_t,
            action: interaction,
            player_b: player_b
        });
    } else {
        stories[name][start_t] = [{
            stop_t: stop_t,
            action: interaction,
            player_b: player_b
        }];
    }
}

function getStats(i) {
    let stats = {};
    let stories = {};
    let players = require(`../servers/server${i}.json`);

    // For all players in the server
    for(let i = 0, l = players.length - 1; i < l; i++) {
        // Instantiate current player statistic structure
        let playtime = 0;
        let intervals = {};

        let name = players[i].key;

        stories[name] = {};

        if(stats[name] === undefined) {
            stats[name] = {
                playtime : 0,
                actions : {},
                killed: {}
            };
        }

        // For all statistics for a single player
        let statCount = players[i].values.length;
        for(let j = 0; j < statCount; j++) {
            let start_t = players[i].values[j].start_t;
            let stop_t = players[i].values[j].stop_t;
            let action = players[i].values[j].key;
            let meta = players[i].values[j].meta;
            let count = +players[i].values[j].count;

            if(!meta) {
                meta = 'count'
            }

            // Action has not been initialized, so simply insert new action
            if (!stats[name].actions[action]) {
                stats[name].actions[action] = {
                    [meta] : count
                };
            } 

            // If the actions was killedby, store in the killer's stats
            if(action === 'KilledBy') {
                let killer = players[i].values[j].player_b;
                // Check if the killer's stats is uninitialized
                if(stats[killer] === undefined) {
                    stats[killer] = {
                        playtime : 0,
                        actions : {},
                        killed: {
                            [name]: count
                        }
                    };
                } else {
                    // Killer's stats were already initialized, so check for player's name
                    if(stats[killer].killed[name]) {
                        stats[killer].killed[name] += count;
                    } else {
                        stats[killer].killed[name] = count;
                    }
                }

                addToStories(stories, name, start_t, stop_t, killer, action);
            }

            if(action === 'Chat') {
                addToStories(stories, name, start_t, stop_t, players[i].values[j].player_b, action);
            }

            // Action has already been inserted, now check the meta
            else {
                // The meta already exists so increment the existing count
                if (stats[name].actions[action][meta]) {
                    stats[name].actions[action][meta] += count;
                } else {
                    // The meta doesn't already exist, so append
                    stats[name].actions[action][meta] = count;
                }
            }

            // Gather the player's play time intervals
            let startTime = players[i].values[j].start_t;
            let stopTime = players[i].values[j].stop_t;
            if(intervals[startTime] === undefined || intervals[startTime] < stopTime) {
                intervals[startTime] = stopTime;
            }
        }

        // Accumulate the total player's play time
        for(let time in intervals) {
            playtime += intervals[time] - time;
        }
        stats[name].playtime = playtime;
    }

    // Sort by the play time
    let roster = Object.keys(stats).sort((a, b) => -(stats[a].playtime - stats[b].playtime)); 
    let newstats = {};
    for(let i = 0; i < roster.length-1; i++) {
        newstats[roster[i]] = stats[roster[i]];
    }

    getStarData(newstats, i, stories);
}

for(let server = 1; server <= 14; server++) {
    console.log(`Getting server ${server} stats...`);
    getStats(server);
}
console.log("Done :^)");

// Player statistic file structure example:
// {
//   "ef2d294c547763a3e149c73161a78de2190672ff": {
//     "playtime": 0,
//     "actions": {
//       "BlockBreak": {
//         "GLASS": 1,
//         "GLOWSTONE": 2,
//         "OTHER": 10,
//         "SMOOTH_BRICK": 16,
//         "IRON_BLOCK": 2
//       },
//       "BlockPlace": {
//         "GLASS": 1,
//         "OTHER": 9,
//         "SMOOTH_BRICK": 24
//       },
//       "Logins": {
//         "America/Los_Angeles": 4
//       },
//       "Kicks": {
//         "": 1
//       }
//     }
//   }
// }
