var tooltip = d3.select('div.tooltip');

function tooltipMouseover(html, x, y) {
    // Load tooltip data here?
    var mouseCoords = d3.mouse(tooltip.node().parentElement);

    tooltip.style('visibility', 'visible').html(html)
        .style('top', x)
        .style('left', y);
}

function tooltipMousemove() {
    tooltip.style('top', `${d3.event.pageY+16}px`)
        .style('left', `${d3.event.pageX+16}px`)
}

function tooltipMouseout() {
    tooltip.style('visibility', 'hidden');
}

