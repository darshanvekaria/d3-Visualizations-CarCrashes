class barModified {
  constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.data.forEach((d) => {
      d["crashes"] = +d["crashes"];
    });
    this.initVis();
  }

  initVis() {
    let vis = this;
    /*vis.margin = {top: 10, right: 40, bottom: 50, left: 140};
            vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
            vis.height = 170 - vis.margin.top - vis.margin.bottom;*/

    /*  vis.margin = { top: 20, right: 60, bottom: 20, left: 50 };*/
    vis.margin = { top: 60, right: 40, bottom: 80, left: 200 };
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right +
      100;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom;
    // vis.width=380;
    // vis.height=366;

    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom + 100)
      .attr("transform", "translate(" + -80 + "," + 0 + ")")
      .append("g")
      .attr(
        "transform",
        "translate(" + (vis.margin.left + 20) + "," + vis.margin.top + ")"
      );

    vis.x = d3
      .scaleBand()
      .range([0, vis.width / 1.5])
      .padding(0.5);
    vis.xAxis = d3.axisBottom().scale(vis.x);

    vis.y = d3.scaleLinear().range([vis.height, 0]).domain(0, 100);
    vis.yAxis = d3.axisLeft().scale(vis.y);

    vis.svg.append("g").attr("class", "y-axis axis").attr("id", "yaxisBar");

    vis.svg
      .append("g")
      .attr("class", "x-axis axis")
      .attr("id", "xaxisBar")
      .attr("transform", "translate(0," + vis.height + ")");

    /*vis.svg
            .append("text")
            .attr("x", vis.width / 3.5)
            .attr("y", -5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .attr("stroke", "#4F7942")
            .text("Total crashes across the USA 2016-2019");*/

    vis.svg
      .append("g")
      .append("text")
      .attr("y", 20)
      .attr("x", vis.width * 0.8)
      .attr("dy", "-3em")
      .attr("text-anchor", "end")
      .style("font-size", "16px")
      .attr("stroke", "#4F7942")
      .text("Top 10 states with most alcohol related crashes");

    vis.svg
      .append("g")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -100)
      .attr("y", 40)
      .attr("y", -45)
      .attr("text-anchor", "end")
      .style("font-size", "16px")
      .attr("stroke", "#4F7942")
      .text("Crashes %");

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.x.domain(
      vis.data.map((d) => {
        return d.state;
      })
    );

    vis.y.domain([0, 100]);

    /*vis.svg.select(".x-axis").transition().call(vis.xAxis);*/

    vis.svg
      .select(".x-axis")
      .transition()
      .call(vis.xAxis)
      .selectAll("text")
      .attr("dx", "-3em")
      .attr("dy", "0.5em")
      .attr("transform", "rotate(-45)")
      .style("font-size", "13px")
      .attr("fill", "#336699");
    /* .attr("font-weight","bold")*/
    vis.svg.select(".y-axis").transition().call(vis.yAxis);

    vis.barcharts = vis.svg.selectAll(".bar").data(vis.data);
    vis.barcharts
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return vis.x(d.state);
      })
      .attr("y", function (d) {
        return vis.y(d.crashes);
      })
      .attr("width", vis.x.bandwidth())
      .attr("height", function (d) {
        return vis.height - vis.y(d.crashes);
      })
      .style("margin-top", "30px")
      .attr("fill", "#336699");

    vis.LabelBar = vis.svg.selectAll(".labelbar").data(vis.data);

    vis.LabelBar.enter()
      .append("text")
      .merge(vis.LabelBar)
      .classed("labelbar", true)
      .attr("x", (d) => vis.x(d.state) + -12 + vis.x.bandwidth())
      .attr("y", (d) => vis.y(d.crashes) - 5)
      .style("opacity", 1)
      .attr("stroke", "#4F7942")
      .style("font-size", "10px")
      .text((d) => d.crashes + "%");
  }
}
