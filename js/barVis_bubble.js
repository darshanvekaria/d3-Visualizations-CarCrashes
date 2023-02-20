/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

class BarChart {
  constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.data.Count = +this.data.Count;
    this.displayData = data;

    this.mainData = this.data;

    console.log(this.displayData);

    this.initVis();
  }

  /*
   * Initialize visualization (static content; e.g. SVG area, axes)
   */

  initVis() {
    let vis = this;

    vis.margin = { top: 70, right: 50, bottom: 25, left: 50 };

    // TODO: #9 - Change hardcoded width to reference the width of the parent element
    // vis.width = 400 - vis.margin.left - vis.margin.right;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom;

    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    // vis.height =
    //   document.getElementById(vis.parentElement).getBoundingClientRect()
    //     .height -
    //   vis.margin.top -
    //   vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom + 50)
      .append("g")
      .attr(
        "transform",
        "translate(" + vis.margin.left + "," + this.margin.top + ")"
      );

    // this.data = this.mainData;

    // vis.x = d3
    //   .scaleLinear()
    //   .range([0, vis.width - 100])
    // .domain([
    //   0,
    //   d3.max(vis.data.values(), function (d) {
    //     return d;
    //   }),
    //   ]);

    vis.x = d3
      .scaleBand()
      .range([0, vis.width])
      .domain(
        vis.data.map(function (d) {
          return d.CrashType;
        })
      )
      .padding(0.6);

    console.log(vis.x.domain());

    // vis.y = d3.scaleLinear().range([vis.width, 0]);

    // vis.y = d3.scaleLinear().domain([0, 200]).range([vis.height, 0]);

    vis.y = d3.scaleLinear().domain([0, 100]).rangeRound([vis.height, 0]);

    // let keys = [];
    // d3.extent(vis.data, function (d) {
    //   keys.push(d[0]);
    //   return d[0];
    // });

    // vis.y = d3.scaleBand().range([0, vis.height]).domain(keys).padding(0.1);

    console.log(vis.y.domain());

    // vis.yAxis = d3.axisLeft().scale(vis.y);

    // vis.xAxis = d3.axisBottom().scale(vis.x).ticks(6);

    // vis.xAxis = d3.axisBottom().scale(vis.x).ticks(6);

    // vis.svg.append("g").attr("class", "y-axis axis");

    // vis.svg
    //   .append("g")
    //   .attr("class", "x-axis axis")
    //   .attr("transform", "translate(0," + vis.height + ")");

    // (Filter, aggregate, modify data)

    // vis.svg
    //   .append("g")
    //   .attr("transform", "translate(0," + vis.height + ")")
    //   // .call(d3.axisBottom(vis.x))
    //   .selectAll("text")
    //   .attr("transform", "translate(-10,0)rotate(-45)")
    //   .style("text-anchor", "end");

    vis.svg
      .append("g")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(d3.axisBottom(vis.x))
      .selectAll("text")
      .attr("dx", 20)
      // .attr("transform", "translate(-10,0)rotate(-45)")
      .attr("stroke", "black")
      .style("font-size", "13px")
      .style("text-anchor", "end");

    vis.svg
      .append("g")
      .attr("class", "axis y-axis")
      .call(d3.axisLeft(vis.y))
      .selectAll("text")

      .attr("stroke", "black")
      .style("font-size", "13px");

    // vis.wrangleData();
    vis.updateVis();
  }

  /*
   * Data wrangling
   */

  wrangleData() {
    let vis = this;

    // this.data = this.mainData;

    vis.mapTemp = d3.rollup(
      this.displayData,
      (v) => v.length,
      (d) => d[this.config.key]
    );

    // (1) Group data by key variable (e.g. 'electricity') and count leaves
    // (2) Sort columns descending

    let dataArr = [];
    for (let [key, value] of vis.mapTemp) {
      dataArr.push([key, value]);
    }

    vis.displayData = dataArr.sort(function (a, b) {
      return b[1] - a[1];
    });

    // * TO-DO *

    // Update the visualization
    vis.updateVis();
  }

  /*
   * The drawing function - should use the D3 update sequence (enter, update, exit)
   */

  updateVis() {
    let vis = this;

    // (1) Update domains
    // (2) Draw rectangles
    // (3) Draw labels

    // * TO-DO *

    vis.svg
      .append("g")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -80)
      .attr("y", -2)
      .attr("dy", "-3em")
      .attr("text-anchor", "end")
      .style("font-size", "16px")
      .attr("stroke", "black")
      .text("% Crashes");

    vis.svg
      .append("text")
      .attr("x", -10)
      .attr("y", -40)

      .style("font-size", "16px")
      .attr("stroke", "steelblue")
      .text("Effect of alcohol in % car crashes");

    vis.svg
      .selectAll("mybar")
      .data(vis.data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return vis.x(d.CrashType);
      })
      .attr("y", function (d) {
        console.log(vis.y(d.Count));
        return vis.y(d.Count);
      })
      .attr("width", vis.x.bandwidth())
      .attr("height", function (d) {
        console.log(d);
        // console.log(vis.y(d.Count));
        return vis.height - vis.y(d.Count);
      })
      .attr("fill", (d) => {
        if (d.CrashType == "Alcoholic") return "rgb(135, 0, 0)";
        return "steelblue";
      });

    vis.svg
      .selectAll(".text")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function (d) {
        return vis.x(d.CrashType);
      })
      .attr("y", function (d) {
        return vis.y(d.Count) - 20;
      })
      .attr("dy", ".75em")
      .text(function (d) {
        console.log(d);
        return d.Count + "%";
      })
      .attr("font-size", "15px")
      .attr("fill", "steelblue");

    /////////////////////////////////////

    // let keys = [];
    // d3.extent(vis.displayData, function (d) {
    //   keys.push(d[0]);
    //   return d[0];
    // });

    // vis.y.domain(keys);
    // vis.x.domain([
    //   0,
    //   d3.max(vis.displayData, function (d) {
    //     return d[1];
    //   }),
    // ]);

    //   vis.rectangle = vis.svg.selectAll("rect").data(vis.displayData);

    //   vis.rectangle
    //     .enter()
    //     .append("rect")
    //     .merge(vis.rectangle)
    //     .attr("class", "bar")
    //     .attr("stroke", "none")
    //     .attr("x", vis.x(0))
    //     .attr("y", (d) => vis.y(d[0]))
    //     .transition()
    //     .duration(500)
    //     .ease(d3.easeLinear)
    //     .attr("height", vis.y.bandwidth())
    //     .attr("width", (d) => vis.x(d[1]))
    //     .attr("fill", "#69b3a2");

    //   vis.rectangle.exit().remove();

    //   vis.svg
    //     .append("text")
    //     .attr("x", vis.width / 35)
    //     .attr("y", -5)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "16px")
    //     .attr("stroke", "#4F7942")
    //     .text(this.config.title);

    //   vis.barLabels = vis.svg.selectAll(".label").data(vis.displayData);

    //   vis.barLabels
    //     .enter()
    //     .append("text")
    //     .merge(vis.barLabels)
    //     .attr("x", function (d) {
    //       return vis.x(d[1]) + 10;
    //     })
    //     .attr("y", function (d) {
    //       return vis.y(d[0]) + 30;
    //     })
    //     .attr("class", "label")
    //     .style("opacity", 1)
    //     .attr("stroke", "black")
    //     .text(function (d) {
    //       return d[1];
    //     });

    //   vis.barLabels.exit().remove();

    //   vis.svg.select(".y-axis").call(vis.yAxis);
    // }

    /*
     * Filter data when the user changes the selection
     * Example for brushRegion: 07/16/2016 to 07/28/2016
     */
  }
}
