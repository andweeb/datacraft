var tooltip = d3.select('div.tooltip');

function tooltipMouseover(data, bubble, i) {
    // Load tooltip data here?
    tooltip.style('visibility', 'visible').html(d => `<div class="tooltip-title"> Server </div>`);
}

function tooltipMousemove() {
    tooltip.style('top', `${d3.event.pageY+16}px`)
        .style('left', `${d3.event.pageX+16}px`)
}

function tooltipMouseout() {
    tooltip.style('visibility', 'hidden');
}
