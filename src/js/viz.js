var force;
var circle;
var spectrum;
var nodes = [];
var height = viewport().height;
var radius = d3.scale.sqrt().range([0, 12]);
var width = Number((viewport().width * 0.8).toFixed(1));

var canvas = d3.select('.canvas')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', `translate(${width/2.5}, ${height/2.8})`);

canvas.style('opacity', 1e-6)
    .transition()
    .duration(1000)
    .style('opacity', 1);

d3.csv('data/servers/overview.csv', (error, data) => {
    if(error) throw error;

    // Find the constant to map the population data to the radius range [20px, 80px]
    var minPopulation = Math.min.apply(Math, data.map(o => Number(o.player_population)));
    var maxPopulation = Math.max.apply(Math, data.map(o => Number(o.player_population)));
    var slope = (90 - 30) / (maxPopulation - minPopulation);

    var horizx = d3.scale.ordinal()
        .domain(d3.range(14))
        .rangePoints([0, width/1.2], 1);

    data.map((e, i) => {
        var r = 30 + slope * (Number(e.player_population) - minPopulation);
        var ratio = (Number(e.chat_interactions) / 
            (Number(e.chat_interactions) + Number(e.players_killed))).toFixed(2);

        nodes.push({
            cx: 100,
            cy: 100,
            radius: r,
            ratio: ratio,
            horizy: height/5,
            id: data[i].server_num,
            color: interpolateColor(ratio)
        });

        data[i].ratio = ratio;
        data[i].focused = false;
        data[i].color = interpolateColor(ratio);
    });

    nodes.sort((a, b) => a.radius - b.radius);
    nodes.map((e, i) => { 
        e.sizex = e.radius + horizx(i) - width/2.5; 
        e.sizez = i;
        return e; 
    });
    nodes.sort((a, b) => a.ratio - b.ratio);
    nodes.map((e, i) => { 
        e.colorx = e.radius + horizx(i) - width/2.5; 
        e.colorz = i;
        return e; 
    });

    startForceLayout(data);
});

function viewport() {
    var e = window;
    var a = 'inner';

    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }

    return { 
        width : e[ a+'Width' ],
        height : e[ a+'Height' ]
    };
}

function interpolateColor(ratio) {
    var color = d3.scale.linear()
        .domain([0, 0.6, 1])
        .range([
            'hsl(0, 75%, 50%)', 
            'hsl(57, 100%, 50%)',
            'hsl(145, 75%, 70%)',
        ]);

    return color(ratio);
}

function showSpectrum() {
    var colorbar = [];
    for(var i = 0; i < 100; i++) {
        colorbar.push({
            x: i,
            color: interpolateColor(i/100)
        });
    }

    spectrum = canvas.selectAll('rect')
        .data(colorbar)
        .enter()
        .append('rect')
        .attr('x', d => d.x)
        .attr('y', 0)
        .attr('width', '100px')
        .attr('height', '15px')
        .style('fill', d => d.color)
}

// showSpectrum();

