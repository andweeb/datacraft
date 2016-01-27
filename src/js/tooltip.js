var tooltip = d3.select('div.tooltip');

function tooltipMouseover(data, bubble, i) {
    // Load tooltip data here?
    var mouseCoords = d3.mouse(tooltip.node().parentElement);
    var style = `"position: absolute;
                 text-align: center;
                 width: 100%;
                 top: 0;
                 left:0;"`;

    tooltip.style('visibility', 'visible')
        .html(`<strong style=${style}>Server ${bubble.id}</strong>`);
}

function tooltipMousemove() {
    tooltip.style('top', `${d3.event.pageY+16}px`)
        .style('left', `${d3.event.pageX+16}px`)
}

function tooltipMouseout() {
    tooltip.style('visibility', 'hidden');
}

