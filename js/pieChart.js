/* * * * * * * * * * * * * *
 *         PieChart         *
 * * * * * * * * * * * * * */

class PieChart {
  // constructor method to initialize Timeline object
  constructor(parentElement, data) {
    this.data = data;
    this.parentElement = parentElement;
    this.circleColors = ["#b2182b", "#d6604d", "#f4a582", "#fddbc7"];

    // call initVis method
    this.initVis();
  }

  initVis() {
    let vis = this;

    // margin conventions
    vis.margin = { top: 10, right: 50, bottom: 10, left: 50 };
    // vis.width = 600;
    vis.height = 600;
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom;

    console.log("Pie chart width height =======>>>>", vis.width, vis.height);

    // init drawing area
    vis.svg = d3
      .select("#" + "pieDivRight")
      .append("svg")
      .attr("width", vis.width)
      .attr("height", vis.height)
      .attr("transform", "translate(" + 60 + "," + 30 + ")")
      .append("g")
      .attr("transform", "translate(" + 0 + "," + 0 + ")");

    // add title
    // vis.svg
    //   .append("g")
    //   .attr("class", "title pie-title")
    //   .append("text")
    //   .text("Weather Conditions during the accidents")
    //   .attr("transform", `translate(${vis.width / 2}, 0)`)
    //   .attr("text-anchor", "middle");

    // TODO

    vis.pieChartGroup = vis.svg
      .append("g")
      .attr("class", "pie-chart")
      .attr(
        "transform",
        "translate(" + vis.width / 2 + "," + vis.height / 2.5 + ")"
      );

    vis.outerRadius = vis.width / 2.2;
    vis.innerRadius = vis.width / 8; // Relevant for donut charts

    vis.pie = d3.pie().value((d) => d[1]);

    vis.arc = d3
      .arc()
      .innerRadius(vis.innerRadius)
      .outerRadius(vis.outerRadius);

    // append tooltip
    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "pieTooltip");

    this.wrangleData();
  }

  // wrangleData method
  wrangleData() {
    let vis = this;

    if (selectedPieCategory == "all") {
      vis.displayData = vis.data;
    } else {
      vis.displayData = vis.data.filter(function (d) {
        if (d.State == selectedPieCategory) return d;
      });
    }

    console.log(vis.displayData);

    vis.allState = [];
    vis.displayData.forEach((element) => {
      vis.allState.push(element.State);
    });

    vis.tempStates = d3.rollup(
      vis.allState,
      (v) => v.length,
      (d) => d
    );

    console.log(vis.tempStates);

    vis.weatherData = [];
    vis.displayData.forEach((element) => {
      vis.weatherData.push(element.Weather_Condition);
    });

    console.log(vis.weatherData);

    vis.dataTemp = d3.rollup(
      vis.weatherData,
      (v) => v.length,
      (d) => d
    );

    console.log("Data Temp ==> " + vis.dataTemp);

    vis.displayData = [];

    vis.totalVal = 0;
    for (let [key, value] of vis.dataTemp) {
      vis.totalVal += value;
      vis.displayData.push([key, value]);
    }

    console.log(vis.displayData);
    // generate random data
    // for (let i = 0; i < 4; i++) {
    //   let random = Math.floor(Math.random() * 100);
    //   vis.displayData.push({
    //     value: random,
    //     color: vis.circleColors[i],
    //   });
    // }

    vis.updateVis();
  }

  // updateVis method
  updateVis() {
    let vis = this;

    // console.log(vis.weatherData);

    vis.numColors = 20;
    vis.greenRange = ["powderblue", "darkblue"];

    vis.colors = d3
      .scaleLinear()
      .domain([0, vis.numColors])
      .range(vis.greenRange);

    vis.arcs = vis.pieChartGroup
      .selectAll(".arc")
      .data(vis.pie(vis.displayData));

    // console.log(arcs);
    vis.arcs
      .enter()
      .append("path")
      .attr("d", vis.arc)
      .merge(vis.arcs)
      .style("fill", function (d, index) {
        // return vis.colors(index);
        if (d.data[0].toLowerCase().includes("rain")) return "steelblue";
        else if (d.data[0].toLowerCase().includes("scattered"))
          return "#94b3de";
        else if (d.data[0].toLowerCase().includes("part")) return "maroon";
        else if (d.data[0].toLowerCase().includes("cloud")) return "olive";
        else if (d.data[0].toLowerCase().includes("snow")) return "purple";
        else if (d.data[0].toLowerCase().includes("clear")) return "darkgrey";
        else if (d.data[0].toLowerCase().includes("drizzle"))
          return "darkgreen";
        else if (d.data[0].toLowerCase().includes("fog")) return "darkred";
        else if (d.data[0].toLowerCase().includes("overcast")) return "#CD7F32";
        return "#033E3E";
      })
      .on("mouseover", function (event, d) {
        console.log(d);
        d3.select(this)
          .attr("stroke-width", "2px")
          .attr("stroke", "black")
          .attr("fill", "rgba(173,222,255,0.62)");

        vis.tooltip
          .style("opacity", 1)
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY + "px").html(`
          <div style="border: thin solid white; border-radius: 5px; background: black; padding: 20px;">
              <h5 style="opacity:1; color:white"> ${d.data[0]}<h5>
              <h6 style="opacity:1; color:white"> value: ${Math.ceil(
                (d.data[1] / vis.totalVal) * 100
              )}%</h6>
        
          </div>`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .attr("stroke-width", "0px")
          .attr("fill", (d) => d.data.color);

        vis.tooltip
          .style("opacity", 0)
          .style("left", 0)
          .style("top", 0)
          .html(``);
      });

    vis.arcs
      .enter()
      .append("text")
      .merge(vis.arcs)
      .text(function (d) {
        let x = Math.ceil((d.data[1] / vis.totalVal) * 100);
        if (x < 9) return "";
        else return d.data[0];
      })
      .attr("transform", function (d, i) {
        console.log("Values==> " + d.data[0] + "==>" + vis.arc.centroid(d));
        return "translate(" + vis.arc.centroid(d) + ")";
      })
      .attr("fill", "#002266")
      .attr("stroke-width", "0.8px")
      .attr("stroke", "black")
      .style("text-anchor", "middle")
      .style("font-size", function (d) {
        let x = Math.ceil((d.data[1] / vis.totalVal) * 100);
        return 10 + x / 2.5;
      });

    vis.arcs.exit().remove();
    // TODO
  }
}
