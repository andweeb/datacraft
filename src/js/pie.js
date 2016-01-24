function showPieChart() {
    var pie = d3.layout.pie() 
        .sort(null)
        .value(d => d.value);
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(0);

    
};
