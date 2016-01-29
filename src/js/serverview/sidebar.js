var playerForce = null;
var playerCanvas = null;
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

function initCanvas() {
    var newcanvas = document.getElementsByClassName('canvas')[0];
    newcanvas.childNodes[0].transform = '';
    newcanvas.childNodes[0].childNodes[0].style.transform = 'translate(2vw, 20vh)';

    d3.select('.svg')
        .attr('width', width/2)
        .attr('transform', '');
}

function initForceLinkLayout() {
    console.log('in initForceLinkLayout()');
    playerCanvas = d3.select('.canvas')
        .append('svg')
        .attr('class', 'player-interactions')
        .attr('width', width/2)
        .attr('height', height)
        .style('transform', 'translate(0vw, 2vh)')
        .style('position', 'absolute');

    playerCanvas.style('opacity', 1e-6)
        .transition()
        .duration(1000)
        .style('opacity', 1);

        // index - the zero-based index of the node within the nodes array.
        // x - the x-coordinate of the current node position.
        // y - the y-coordinate of the current node position.
        // px - the x-coordinate of the previous node position.
        // py - the y-coordinate of the previous node position.
        // fixed - a boolean indicating whether node position is locked.
        // weight - the node weight; the number of associated links.

    playerForce = d3.layout.force()
        .nodes([{
            x: 100,
            y: 100,
            name: 'Andrew',
            index: 0,
        }])
        .size([ width/2, height/1.5 ])
        .on("tick", playerTick)
        .start()
}

function playerTick() {
    var nodes = playerCanvas.selectAll(".node")
        .data(playerForce.nodes(), function(d) {
            return d.index;
        });

    nodes
        .attr("cx", function(d) {
            return d.x
        })
        .attr("cy", function(d) {
            return d.y
        });

    nodes
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("fill", "Red")
        .call(playerForce.drag)
        .attr("class", "node")
        .attr("cx", function(d) {
            return d.x
        })
        .attr("cy", function(d) {
            return d.y
        });

    // // add the text 
    // nodes.append("text")
    //     .attr("x", 12)
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.name; });

    nodes
        .exit()
        .remove()
}

function initPlayerList(id) {
    tooltipMouseout();
    initRadarChart();
    initSlider();
    initForceLinkLayout();

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

    initCanvas();
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
