BrushVis = function (_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.displayData = [];
  this.parseDate = d3.timeParse("%m/%d/%Y");

  // call method initVis
  // this.initVis();
};

// init brushVis
BrushVis.prototype.initVis = function () {
  let vis = this;

  vis.margin = { top: 20, right: 50, bottom: 20, left: 50 };
  // vis.width =
  //   document.getElementById(vis.parentElement).getBoundingClientRect().width -
  //   vis.margin.left -
  //   vis.margin.right;
  // vis.height =
  //   document.getElementById(vis.parentElement).getBoundingClientRect().height -
  //   vis.margin.top -
  //   vis.margin.bottom;

  vis.width =
    document.getElementById(vis.parentElement).getBoundingClientRect().width -
    vis.margin.left -
    vis.margin.right;
  vis.height =
    document.getElementById(vis.parentElement).getBoundingClientRect().height -
    vis.margin.top -
    vis.margin.bottom;
  console.log("brush height and width =>-----", vis.height, vis.width);
  // SVG drawing area
  vis.svg = d3
    .select("#" + vis.parentElement)
    .append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + vis.margin.left + "," + vis.margin.top + ")"
    );

  // clip path
  vis.svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", vis.width)
    .attr("height", vis.height);

  // add title
  vis.svg
    .append("g")
    .attr("class", "title")
    .append("text")
    .text(
      "Mississippi consistently has the highest rate of accidents relative to pupulation over the years. Brush over to explore more."
    )
    .attr("transform", `translate(${vis.width / 2}, 0)`)
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .style("fill", "steelblue");

  vis.x_title = vis.svg
    .append("g")
    .attr("class", "title")
    .append("text")
    .text("Fatality Count")
    .attr("x", -80)
    .attr("y", -20)
    .attr("transform", "rotate(-90)");

  // init scales
  vis.x = d3.scaleLinear().range([0, vis.width]);
  vis.y = d3.scaleLinear().range([vis.height, 0]);

  // init x & y axis
  vis.xAxis = vis.svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + vis.height + ")");
  vis.yAxis = vis.svg.append("g").attr("class", "axis axis--y");

  // init pathGroup
  vis.pathGroup = vis.svg.append("g").attr("class", "pathGroup");

  // init path one (average)
  vis.pathOne = vis.pathGroup.append("path").attr("class", "pathOne");

  // init path two (single state)
  vis.pathTwo = vis.pathGroup.append("path").attr("class", "pathTwo");

  // init path generator
  vis.area = d3
    .area()
    // .curve(d3.curveMonotoneX)
    .x(function (d) {
      return vis.x(d.date);
    })
    .y0(vis.y(0))
    .y1(function (d) {
      return vis.y(d.newCases);
    });

  // init brushGroup:
  vis.brushGroup = vis.svg.append("g").attr("class", "brush");

  // init brush
  vis.brush = d3
    .brushX()
    .extent([
      [0, 0],
      [vis.width, vis.height],
    ])
    .on("brush end", function (event) {
      selectedTimeRange = [
        parseInt(vis.x.invert(event.selection[0])),
        parseInt(vis.x.invert(event.selection[1])),
      ];
      //  console.log(selectedTimeRange);
      myMapVis.wrangleData(); // TODO: Uncomment when implemented
      myDataTable.wrangleData();
      myBarVisOne.wrangleData();
      // myBarVisOne.wrangleData(); // TODO: Uncomment when implemented
      // myBarVisTwo.wrangleData(); // TODO: Uncomment when implemented
    });

  // init basic data processing
  this.wrangleDataStatic();
};

// init basic data processing - prepares data for brush - done only once
BrushVis.prototype.wrangleDataStatic = function () {
  let vis = this;

  vis.preProcessedData = [];

  console.log(vis.preProcessedData);
  // USA, 36096, 36835, 37473, 37806, 148210;
  vis.fatal_processed = [];
  vis.fatal_processed.push({ date: 2016, newCases: 37806, newDeaths: 0 });
  vis.fatal_processed.push({ date: 2017, newCases: 37473, newDeaths: 0 });
  vis.fatal_processed.push({ date: 2018, newCases: 36835, newDeaths: 0 });
  vis.fatal_processed.push({ date: 2019, newCases: 36096, newDeaths: 0 });

  console.log(vis.fatal_processed);
  vis.preProcessedData = vis.fatal_processed;

  this.wrangleDataResponsive();
};

// additional DataFiltering - only needed if we want to draw a second chart
BrushVis.prototype.wrangleDataResponsive = function () {
  let vis = this;

  vis.filteredData = [];

  // filter
  if (selectedState !== "") {
    vis.data.forEach((date) => {
      if (selectedState === nameConverter.getFullName(date.state)) {
        vis.filteredData.push(date);
      }
    });
  }

  // rearrange data structure and group by state
  let dataByDate = Array.from(
    d3.group(vis.filteredData, (d) => d.submission_date),
    ([key, value]) => ({ key, value })
  );

  vis.dataPathTwo = [];

  // iterate over each year
  dataByDate.forEach((year) => {
    let tmpSumNewCases = 0;
    let tmpSumNewDeaths = 0;
    year.value.forEach((entry) => {
      tmpSumNewCases += +entry["new_case"];
      tmpSumNewDeaths += +entry["new_death"];
    });

    vis.dataPathTwo.push({
      date: vis.parseDate(year.key),
      newCases: tmpSumNewCases,
      newDeaths: tmpSumNewDeaths,
    });
  });
  vis.dataPathTwo.sort((a, b) => {
    return a.date - b.date;
  });

  this.wrangleData();
};

// wrangleData - gets called whenever a state is selected
BrushVis.prototype.wrangleData = function () {
  let vis = this;

  // Update the visualization
  this.updateVis();
};

// updateVis
BrushVis.prototype.updateVis = function () {
  let vis = this;

  // update domains
  vis.x.domain(
    d3.extent(vis.preProcessedData, function (d) {
      console.log("date here =>>>", d.date);
      return d.date;
    })
  );

  vis.y.domain([
    35000,
    d3.max(vis.preProcessedData, function (d) {
      return d.newCases;
    }),
  ]);

  // draw x & y axis
  vis.xAxis
    .transition()
    .duration(400)
    .call(
      d3
        .axisBottom(vis.x)
        .ticks(4)
        .tickFormat((d) => d)
    );
  vis.yAxis.transition().duration(400).call(d3.axisLeft(vis.y).ticks(0));

  // draw pathOne
  vis.pathOne
    .datum(vis.preProcessedData)
    .transition()
    .duration(400)
    .attr("d", vis.area)
    .attr("fill", "rgb(249, 206, 96)")
    .attr("stroke", "rgb(255, 172, 0)")
    .attr("clip-path", "url(#clip)");

  // draw pathOne

  vis.brushGroup.call(vis.brush);
};
