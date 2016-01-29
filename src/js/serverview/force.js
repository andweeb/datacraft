var playerForce = null;
var playerCanvas = null;

function drawForceLayout(name, story, color) {
    console.log('in drawForceLayout()');
    console.log(story);

    if(playerCanvas) {
        playerCanvas.transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
    }

    var nodes = [];
    nodes.push({
        x: 350,
        y: 400,
        r: 20,
        name: name,
        color: color,
        index: 0,
        fixed: true
    },
    {
        x: 360,
        y: 200,
        r: 10,
        fixed: false
    });

    var links = [
        { source: 0, target: 1 }
    ];


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
        .nodes(nodes)
        .links(links)
        .linkDistance(80)
        .size([ width/2, height/1.5 ])
        .charge(-800)
        .on("tick", playerTick)
        .start()

    var link = playerCanvas.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    initCanvas();
    initSlider();
}

function playerTick() {
    playerCanvas.selectAll(".link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

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

    // // add the text 
    // nodes.append("text")
    //     .attr("x", 12)
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.name; });

    nodes
        .exit()
        .remove()
}

