var chart;
var spider;
var playerData;
var playerStats = {};
var global_ref = [];
var global_starchart = [];

function servercraft(id) {
    
    // d3.json(`data/servers/server${id}players.json`, (error, data) => {
    //     if(error) throw error;
    //     console.log(JSON.stringify(data,null,2));
    // });

}

function initRadarChart() {
    chart = RadarChart.chart();
    var lol = [{
        axes: [
            {axis: "Crafter", value: 0}, 
            {axis: "PvPer", value: 0}, 
            {axis: "Builder", value: 0},  
            {axis: "Miner", value: 0},
            {axis: "Socializer", value: 0},  
        ]
    }];

    chart.config({ 
        levels: 3,
        circles: false,
        maxValue: 1,
        minValue: 0,
    });

    canvas.append('g')
        .classed('spider', 1)
        .datum(lol)
        .transition()
        .call(chart);
}

function rando() {
    return Math.random();
}

function randomHSL() {
    let num = Math.floor((Math.random() * 1000) + 1)
    return {
        selection: `hsl(${num}, 78%, 90%)`,
        chart: `hsl(${num}, 78%, 50%)`,
    };
}

function constructAxes(data, i) {
    var axes = [];
    var craftRecord = maxes[i-1].CraftedItems;
    if(craftRecord) {
        axes.push({ 
            axis: 'Crafter',
            value: (data.summary.CraftedItems || 0) / craftRecord
        });
    }

    var buildRecord = maxes[i-1].BlockPlace;
    if(buildRecord) {
        axes.push({
            axis: 'Builder',
            value: (data.summary.BlockPlace || 0) / buildRecord
        });
    }

    var minerRecord = maxes[i-1].BlockBreak;
    if(minerRecord) {
        axes.push({
            axis: 'Miner',
            value: (data.summary.BlockBreak || 0) / minerRecord
        });
    }

    var pvpRecord = maxes[i-1].Killed;
    if(pvpRecord) {
        axes.push({
            axis: 'PvPer',
            value: (data.summary.Killed || 0) / pvpRecord
        });
    }

    var socialRecord = maxes[i-1].Chat;
    if(socialRecord) {
        axes.push({
            axis: 'Socializer',
            value: (data.summary.Chat || 0) / socialRecord
        });
    }

    return axes;
}

function drawStarPlot(name, i, element, dblclick) {
    console.log(name);
    console.log(i);
    console.log(element);

    var id = '';
    var hsl = '';
    var data = null;
    var selected = false;
    var ref = null;

    if(global_ref.length && !dblclick) {
        for(let i = 0; i < global_ref.length; i++) {
            document.getElementById(global_ref[i].id).style.backgroundColor = 'transparent';
        }
    }

    if(element.target.nodeName === "TD") {
        ref = element.target.parentElement;
        id = element.target.parentElement.id;
        data = element.target.parentElement.data;
        selected = element.target.parentElement.selected;
    } else if(element.target.nodeName === "TR") {
        ref = element.target;
        id = element.target.id;
        data = element.target.data;
        selected = element.target.selected;
    }

    global_ref.push(ref);

    if(selected && !dbclick) {
        document.getElementById(id).style.backgroundColor = 'transparent';
    } else {
        hsl = randomHSL();
        document.getElementById(id).style.backgroundColor = hsl.selection;
    }

    var chartdata = {
        color: hsl.chart,
        axes: constructAxes(data, i)
    };

    if(dblclick) {
        global_starchart.push(chartdata);
    } else {
        global_starchart = [chartdata];
    }

    chart.config({ 
        levels: 3,
    });

    spider = canvas.selectAll('g.spider')
        .data([global_starchart]);

    spider.enter().append('g')
        .classed('spider', 1);

    spider.call(chart);

    return hsl;
}
