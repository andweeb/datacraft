var dblclick_timer = false

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
    document.getElementsByClassName('main-title')[0].innerHTML = ``;
    document.getElementsByClassName('title')[0].innerHTML = `Server ${id} Overview`;
    document.getElementsByClassName('info')[0].remove();
    document.getElementsByClassName('preview')[0].remove();

    var info = document.createElement('div');
    info.className = 'info';
    info.style.overflowY = 'scroll';
    info.style.height = '85vh';
    info.style.marginBottom = '2vh';

    document.getElementsByClassName('sidebar')[0].appendChild(info);

    servers.transition() 
        .duration(1000)
        .style('opacity', 0)
        .remove()
        .call(endAll, initPlayerList, id);
}

function initPlayerList(id) {
    tooltipMouseout();
    initRadarChart();

    document.getElementsByClassName('info')[0].innerHTML = 'Loading...';

    var playerTable = document.createElement('table');
    playerTable.className = 'player-table';

    var headerRow = document.createElement('tr');
    headerRow.className = 'player-header-row';
    var headerName = document.createElement('th');
    headerName.innerHTML = 'Player Name';
    var headerTime = document.createElement('th');
    headerTime.innerHTML = 'Logged Playtime';
    headerTime.style.paddingLeft = '2vw';

    headerRow.appendChild(headerName);
    headerRow.appendChild(headerTime);
    playerTable.appendChild(headerRow);

    d3.json(`data/players/players${id}.json`, (error, data) => {
        if(error) throw error;

        var count = 0;
        for(var name in data) {

            var randomName = getName(4, 8);
            var player = document.createElement('tr');
            player.className = 'player';
            player.addEventListener("click", function(name, i, event) {
                if(dblclick_timer) {
                    console.log('dblclick');
                    clearTimeout(dblclick_timer);
                    dblclick_timer = false;
                    onPlayerClick(name, i, event, true);
                } else { 
                    dblclick_timer = setTimeout(function() {
                        console.log('single click');
                        dblclick_timer = false;
                        onPlayerClick(name, i, event, false);
                    }, 250)
                } 
            }.bind(data[name], randomName, id));

            var nameBox = document.createElement('td');
            nameBox.className = 'player-name';
            var timeBox = document.createElement('td');
            timeBox.className = 'playtime';
            var icon = document.createElement('img');

            // Create face icon and append to the table element 
            var imgSrc = faces[Math.round(Math.random() * (faces.length - 1) + 0)];
            icon.src = `data/faces/${imgSrc}`;
            icon.className = 'player-face';

            nameBox.appendChild(icon);
            nameBox.innerHTML += randomName;

            timeBox.innerHTML = convertPlaytime(data[name].playtime*60);

            player.id = name;
            player.className = 'player';
            player.appendChild(nameBox);
            player.appendChild(timeBox);
            player.data = data[name];
            player.selected = false;

            playerTable.appendChild(player);

            count++;
            if(count === 100) 
                break;
        }
    });

    document.getElementsByClassName('info')[0].style.height = '80vh';
    document.getElementsByClassName('info')[0].innerHTML = '';
    document.getElementsByClassName('info')[0].appendChild(playerTable);
    
    initRestartButton();
    servercraft(id);
}

function initRestartButton() {
    var restartButton = document.createElement('button');
    restartButton.innerHTML = "Restart Visualization";
    restartButton.className = "sidebar-button";
    restartButton.addEventListener('click', function() {
        location.reload(false); 
    })

    document.getElementsByClassName('sidebar')[0].appendChild(restartButton);
}
