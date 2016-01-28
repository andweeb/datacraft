var playerData;

function servercraft(id) {
    
    // d3.json(`data/servers/server${id}players.json`, (error, data) => {
    //     if(error) throw error;
    //     console.log(JSON.stringify(data,null,2));
    // });

}

function onPlayerClick(data, name, element) {
    console.log('--> in onPlayerClick()');
    console.log(data);
    console.log(element);
    var translate = `translate(-${width/3}px, -${height/3}px)`;
    hsl(0.10, 78%, 91%)

    var meep = [
      {
        className: 'germany', // optional can be used for styling
        axes: [
          {axis: "Crafter", value: 0.13}, 
          {axis: "PvPer", value: 0.6}, 
          {axis: "Builder", value: 0.5},  
          {axis: "Socializer", value: 0.9},  
          {axis: "Miner", value: 0.2}
        ]
      },
      {
        className: 'argentina',
        axes: [
          {axis: "strength", value: 0.6}, 
          {axis: "intelligence", value: 0.7}, 
          {axis: "charisma", value: 0.10},  
          {axis: "dexterity", value: 0.13},  
          {axis: "luck", value: 0.9}
        ]
      }
    ]

    var chart = RadarChart.chart();

    chart.config({ 
        levels: 5,
        maxValue: 1,
        minValue: 0,
    });

    canvas.append('g')
        .classed('focus', 1)
        .datum(meep)
        .transition()
        .style('transform', translate)
        .call(chart);
}
