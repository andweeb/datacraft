function convertPlaytime(seconds) {
	var value = seconds;
	var units = {
		 "day": 24*60*60,
		 "hr": 60*60,
		 "min": 60,
		 "sec": 1
	}

	var result = []
	for(var name in units) {
	  var p =  Math.floor(value/units[name]);
	  if(p == 1) result.push(p + " " + name);
	  if(p >= 2) result.push(p + " " + name + "s");
	  value %= units[name]
	}
	return result.join(', ');
}

// Server id starts from 1 (not 0)
function initServerviewSidebar(id) {
    document.getElementsByClassName('title')[0].innerHTML = `Server ${id} Overview`;
    document.getElementsByClassName('info')[0].remove();
    document.getElementsByClassName('preview')[0].remove();

    var info = document.createElement('div');
    info.className = 'info';
    info.style.overflowY = 'scroll';
    info.style.height = '85vh';

    document.getElementsByClassName('sidebar')[0].appendChild(info);

    servers.transition() 
        .duration(1000)
        .style('opacity', 0)
        .remove()
        .call(endAll, initPlayerList, id);
}

function initPlayerList(id) {

    document.getElementsByClassName('info')[0].innerHTML = 'Loading...';

    var playerTable = document.createElement('table');
    playerTable.className = 'player-table';

    var headerRow = document.createElement('tr');
    headerRow.className = 'player-header-row';
    var headerName = document.createElement('th');
    headerName.innerHTML = 'Player Name';
    var headerTime = document.createElement('th');
    headerTime.innerHTML = 'Logged Playtime';
    headerTime.style.paddingLeft = '2.1rem';

    headerRow.appendChild(headerName);
    headerRow.appendChild(headerTime);
    playerTable.appendChild(headerRow);

    d3.json(`data/servers/server${id}players.json`, (error, data) => {
        if(error) throw error;

        var count = 0;
        for(var name in data) {

            var player = document.createElement('tr');
            player.className = 'player';
            var nameBox = document.createElement('td');
            nameBox.className = 'player-name';
            var timeBox = document.createElement('td');
            timeBox.className = 'playtime';
            var icon = document.createElement('img');

            // Create face icon and append to the table element 
            var imgSrc = faces[Math.round(Math.random() * (faces.length - 1) + 0)];
            icon.src = `data/faces/${imgSrc}`;
            icon.style.width = '1rem';
            icon.style.paddingLeft = '.5rem';
            icon.style.paddingRight = '.4rem';
            nameBox.appendChild(icon);
            nameBox.innerHTML += getName(4, 8);

            timeBox.innerHTML = convertPlaytime(data[name].playtime*60);

            player.id = name;
            player.className = 'player';
            player.appendChild(nameBox);
            player.appendChild(timeBox);
            player.playtime = data[name].playtime;
            player.actions = data[name].actions;

            playerTable.appendChild(player);

            count++;
            if(count === 100) 
                break;
        }
    });

    document.getElementsByClassName('info')[0].innerHTML = '';
    document.getElementsByClassName('info')[0].appendChild(playerTable);

    servercraft(id);
}
