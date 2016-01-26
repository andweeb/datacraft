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
    // d3.csv(`data/servers/serverview${id}.csv`, (error, data) => {
    //     if(error) throw error;
    //     console.log(data);
    // });

    var faces = [
        'alex.png',
        'creeper.jpg',
        'ender.png',
        'steve.png',
        'villager.png',
        'grayface.png',
        'ironman.jpg',
        'cavespidey.jpg',
        'pigman.png',
        'zombie.png',
        'wolf.png',
        'skelly.png',
        'witherskelly.png',
        'wither.png',
        'pumpkin.png',
        'sheep.png',
        'mooshroom.png',
        'golem.png',
        'chicken.png',
        'magma.jpg',
        'pig.jpg',
        'cow.png',
        'blaze.png',
        'slime.png',
        'elderguardian.png',
        'squid.png',
        'witch.png',
        'spider.png',
        'guardian.png',
        'ghast.png',
        'enderdragon.png',
        'endermite.png',
        'bajan.png',
        'kakashi.jpg',
        'walrus.jpg',
        'deadpool.png',
        'bionicle.png',
    ];

    document.getElementsByClassName('info')[0].innerHTML = 'Loading...';

    var playerList = document.createElement('ul');
    playerList.className = 'player-list';
    document.getElementsByClassName('sidebar')[0].appendChild(playerList);
    for(var i = 0; i < 100; i++) {
        var player = document.createElement('li');

        var icon = document.createElement('img');
        var face = faces[Math.round(Math.random() * (faces.length - 1) + 0)]
        icon.src = `data/faces/${face}`;
        icon.style.width = '1rem';
        icon.style.paddingLeft = '.5rem';
        icon.style.paddingRight = '.4rem';
        player.appendChild(icon);

        var playerName = document.createElement('span');
        playerName.innerHTML = getName(4, 8);
        player.appendChild(playerName);

        playerList.appendChild(player);
    }

    document.getElementsByClassName('info')[0].innerHTML = '';
    document.getElementsByClassName('info')[0].appendChild(playerList);

    servercraft();
}
