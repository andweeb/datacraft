'use strict';
var fs = require('fs');
var d3 = require('d3');

for(let i = 1; i <= 14; i++) {
    console.log(`Reading server${i}.csv...`);
    fs.readFile(`../../../data/servers/server${i}.csv`, 'utf8', (err, data) => {
        
        let nest = d3.nest()
            .key(d => d.player_a)
            .entries(d3.csv.parse(data))

        fs.writeFile(`./data/server${i}.json`, JSON.stringify(nest, null, 2));
    })
}
