class InnovativeBar {
  constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = data;
    this.initVis();
  }

  initVis() {
    let vis = this;
    /*vis.margin = {top: 10, right: 40, bottom: 50, left: 140};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 170 - vis.margin.top - vis.margin.bottom;*/

    vis.margin = { top: 20, right: 60, bottom: 20, left: 50 };
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right +
      200;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom;

    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom + 100)
      .attr("transform", "translate(" + -80 + "," + -10 + ")")
      .append("g")
      .attr(
        "transform",
        "translate(" + (vis.margin.left + 20) + "," + vis.margin.top + ")"
      );

    vis.x = d3
      .scaleLinear()
      .range([0, vis.width / 1.5])
      .domain(0, 350);
    vis.xAxis = d3
      .axisBottom()
      .scale(vis.x)
      .tickFormat((d) => d / 1000 + "k");

    vis.y = d3.scaleBand().range([vis.margin.top, vis.height]).padding(0.5);
    //   .paddingInner(0.8);

    vis.yScale = d3
      .scaleBand()
      .domain(
        vis.data.map((d) => {
          return d.time;
        })
      )
      .range([vis.margin.top, vis.height + 50])
      .padding(0.6);

    vis.yAxis = d3.axisLeft().scale(vis.y);

    vis.svg.append("g").attr("class", "y-axis axis").attr("id", "yaxisBar");
    vis.svg
      .append("g")
      .attr("class", "x-axis axis")
      .attr("id", "xaxisBar")
      .attr("transform", "translate(0," + vis.height + ")");

    vis.svg
      .append("text")
      .attr("x", vis.width / 3.5)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr("stroke", "#4F7942")
      .text("Total crashes across the USA 2016-2019");

    vis.svg
      .append("g")
      .append("text")
      .attr("y", vis.height + this.margin.top + this.margin.bottom + 60)
      .attr("x", vis.width / 2)
      .attr("dy", "-3em")
      .attr("text-anchor", "end")
      .style("font-size", "16px")
      .attr("stroke", "#4F7942")
      .text("Count of Crashes");

    vis.svg
      .append("g")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -100)
      .attr("y", 40)
      .attr("y", -45)
      //   .attr("dy", "-0.5em")
      .attr("text-anchor", "end")
      .style("font-size", "16px")
      .attr("stroke", "#4F7942")
      .text("Time of the Day");

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    // (1) Update domains
    vis.x.domain([
      0,
      d3.max(vis.data, (d) => {
        return d.crashes;
      }),
    ]);

    vis.y.domain(
      vis.data.map((d) => {
        return d.time;
      })
    );

    vis.svg.select(".x-axis").transition().call(vis.xAxis);

    vis.svg.select(".y-axis").transition().call(vis.yAxis);

    // (2) Draw rectangles
    vis.barcharts = vis.svg.selectAll(".bar").data(vis.data);
    vis.barcharts
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(vis.barcharts)
      .attr("x", vis.x(0))
      .attr("y", (d) => vis.y(d.time))
      .attr("height", vis.y.bandwidth())
      .attr("width", (d) => vis.x(d.crashes))
      .style("margin-top", "30px")
      .attr("fill", "#336699");

    // (3) Draw labels
    vis.LabelBar = vis.svg.selectAll(".labelbar").data(vis.data);

    vis.LabelBar.enter()
      .append("text")
      .merge(vis.LabelBar)
      .classed("labelbar", true)
      .attr("y", (d) => vis.y(d.time) + 3 + vis.y.bandwidth())
      .attr("x", (d) => vis.x(d.crashes) + 3)
      .style("opacity", 1)
      .attr("stroke", "#4F7942")
      .style("font-size", "15px")
      .text((d) => d.crashes);

    /*   // Update the y-axis
        vis.svg.select(".y-axis").transition().duration(450).style("font-weight","bold").call(vis.yAxis);*/
  }
}
