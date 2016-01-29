var interactions = null;
var playerForce = null;
var playerCanvas = null;

function drawForceLayout(name, story, color) {

    var handles = initSlider();

    if(playerCanvas) {
        playerCanvas.transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
    }

    interactions = getInteractions(name, story, color);

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

    playerForce = d3.layout.force()
        .nodes(interactions.nodes)
        .links(interactions.links)
        .linkDistance(80)
        .size([ width/2, height/1.2 ])
        .charge(-100)
        .on("tick", playerTick)
        .start()

    // add the text 
    d3.select('.node')
        .append("text")
        .text(d => d.name);

    var link = playerCanvas.selectAll(".link")
        .data(interactions.links)
        .enter().append("line")
        .attr("class", "link");

    initCanvas();
}

function randy(min, max) {
    return Math.floor((Math.random() * max) + min);
}

// Return the constructed nodes and links arrays
function getInteractions(name, story, color) {
    var index = 0;
    var links = [];
    var nodes = [];
    nodes.push({
        x: 350,
        y: 400,
        r: 20,
        name: name,
        color: color,
        index: index,
    });

    for(var frame in story) {
        var chapter = story[frame];
        for(var action in chapter) {
            // obj contains action / player_b / stop_t
            index++;
            var obj = chapter[action];

            console.log(obj.action);
            nodes.push({
                x: Math.floor((Math.random() * 400) + 300),
                y: Math.floor((Math.random() * 500) + 300),
                r: 10,
                name: '???',
                color: (obj.action === 'KilledBy') ? `hsl(100, ${randy(40, 100)}%, 50%)` : `hsl(0, ${randy(40, 100)}%, 50%)`,
                index: index
            });

            links.push({
                source: 0,
                target: index
            });

            if(index === 100) {
                return { nodes: nodes, links: links };
            }
        }
    }

    return { nodes: nodes, links: links };
}

function playerTick() {
    playerCanvas.selectAll(".link")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

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
        .attr("r", d => d.r)
        .attr("fill", d => d.color)
        .call(playerForce.drag)
        .attr("class", "node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);


    nodes
        .exit()
        .remove()
}

