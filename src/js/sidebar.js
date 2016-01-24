var selectedServer = null;

function appendSidebarPreview(data, i) {
    var chatters = data[i].chatters;
    var killers = data[i].killers;
    var playerCount = data[i].player_population;

    focusBubble(i);
    d3.select('div.preview')
        .data(data)
        .append('div')
        .attr('id', 'preview-text')
        .html(` <p class="preview-title"><b> Server ${data[i].server_num} </b></p> 
                <p class="preview-text"> 
                This server consists of ${Number(playerCount).toLocaleString()} players, 
                ${((chatters/playerCount)*100).toFixed(1)}% of which conversed with
                others and ${((killers/playerCount)*100).toFixed(1)}% of 
                which engaged in PvP.
                </p> `);
        // .text(JSON.stringify(data[i],null,2));
    // var complement = '#'+(parseInt(data[i].color.substr(1, data[i].color.length), 16) ^ 0xffffff).toString(16)
}

function removeSidebarPreview(data, i) {
    unfocusBubble(i);
    d3.select('div#preview-text').remove();
}

function focusBubble(id) {
    d3.select(`circle#server-${id+1}`)
        .attr('stroke', 'gray')
        .attr('stroke-width', 1.5)
}

function unfocusBubble(id) {
    d3.select(`circle#server-${id+1}`)
        .attr('stroke', 'white');
}

// Depending on the state of the sidebar, show or hide the details
function toggleSidebarDetails(data, bubble, i) {
    console.log('double-clicked');
    if(data[i].focused) {
        unfocusBubble(i);
        removeSidebarDetails(data[i].server_num);
    } else {
        focusBubble(i);
        showSidebarDetails(data, i);
    }
    data[i].focused = !data[i].focused;
}

function showSidebarDetails(data, i) {
    // Remove the previously selected server details and update it
    removeOldDetails(data);
    selectedServer = data[i].server_num;

    // Append the new server details
    var sidebarInfo = d3.select('div.info')
    sidebarInfo.data(data)
        .append('g')
        .attr('id', `server-${data[i].server_num}-details`)
        .style('opacity', 0)
        .transition()
        .delay(100)
        .style('opacity', 1)
        .text(`Server ${data[i].server_num}`);
}

function removeSidebarDetails(serverId) {
    // Remove the sidebar details
    d3.select(`g#server-${serverId}-details`)
        .transition()
        .delay(100)
        .style('opacity', 0)
        .remove();
}

function removeOldDetails(data) {
    // Remove the previously selected server details
    d3.select(`g#server-${selectedServer}-details`)
        .remove();
    if(selectedServer) {
        data[selectedServer].focused = !data[selectedServer].focused;
    }
}
