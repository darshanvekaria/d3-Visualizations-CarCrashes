class lineViz {
  constructor(parentElement, usaData) {
    this.parentElement = parentElement;
    this.usaData = usaData;
    this.usaData.forEach((d) => {
      d["Year"] = +d["Year"];
      d["Total"] = +d["Total"];
    });
    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.margin = { top: 20, right: 60, bottom: 20, left: 50 };
    (vis.width = 800 - vis.margin.left - vis.margin.right),
      (vis.height = 450 - vis.margin.top - vis.margin.bottom);

    // console.log(
    //   "width",
    //   document.getElementById(vis.parentElement).getBoundingClientRect().width -
    //     vis.margin.left -
    //     vis.margin.right
    // );
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    // vis.height =
    //   document.getElementById(vis.parentElement).getBoundingClientRect()
    //     .height -
    //   vis.margin.top -
    //   vis.margin.bottom;

    console.log("LINE HEIGHT ======>>>", vis.height, vis.width);

    vis.svg = d3
      .select("#line-chart")
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + vis.margin.left + "," + vis.margin.top + ")"
      );

    vis.xscale = d3.scaleBand().range([vis.margin.left, vis.width]);

    vis.fatalScale = d3.scaleLinear().range([vis.height, 0]);

    vis.xAxis = d3.axisBottom().scale(vis.xscale);

    vis.yAxis = d3.axisLeft().scale(vis.fatalScale).tickFormat(d3.format("0"));

    vis.svg
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(54," + vis.height + ")");

    vis.svg
      .append("g")
      .attr("class", "axis y-axis")
      .attr("transform", "translate(102,0)");

    vis.linetooltip = d3
      .select("body")
      .append("div")
      .attr("class", "linetooltip");

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.Y2016 = vis.usaData.filter(function (d) {
      if (d.Year == 2016 && d.State == mySelectedState) {
        return d.Total;
      }
    });

    vis.Y2017 = vis.usaData.filter(function (d) {
      if (d.Year == 2017 && d.State == mySelectedState) {
        return d.Total;
      }
    });

    vis.Y2018 = vis.usaData.filter(function (d) {
      if (d.Year == 2018 && d.State == mySelectedState) {
        return d.Total;
      }
    });

    vis.Y2019 = vis.usaData.filter(function (d) {
      if (d.Year == 2019 && d.State == mySelectedState) {
        return d.Total;
      }
    });

    vis.line = d3
      .line()
      .x(function (d) {
        return vis.xscale(d.Month);
      })
      .y(function (d) {
        return vis.fatalScale(d.Total);
      });

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.xscale.domain(
      vis.usaData.map((d) => {
        return d.Month;
      })
    );

    vis.stateData = vis.usaData.filter(function (d) {
      if (d.State == mySelectedState) {
        return d.Total;
      }
    });

    vis.fatalScale.domain([
      0,
      d3.max(vis.stateData, function (d) {
        return d.Total;
      }),
    ]);

    vis.svg.select(".x-axis").transition().call(vis.xAxis);

    vis.svg.select(".y-axis").transition().call(vis.yAxis);

    var size = 15;
    var year = ["2016", "2017", "2018", "2019"];
    var color = d3
      .scaleLinear()
      .domain(["2016", "2017", "2018", "2019"])
      .range(["green", "orange", "#ff00ff", "#9999ff"]);
    vis.svg
      .selectAll("labelbox")
      .data(year)
      .enter()
      .append("rect")
      .attr("x", 820)
      .attr("y", function (d, i) {
        return vis.height / 2 + i * (15 + 5);
      })
      .attr("width", 15)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", function (d) {
        return color(d);
      });

    vis.svg
      .selectAll("labelbox")
      .data(year)
      .enter()
      .append("text")
      .attr("x", 830 + size * 1.2)
      .attr("y", function (d, i) {
        return vis.height / 2 + 2 + i * (size + 5) + size / 2;
      })
      .style("fill", function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    d3.select("#line1").remove();
    d3.select("#line2").remove();
    d3.select("#line3").remove();
    d3.select("#line4").remove();

    vis.svg
      .append("path")
      .datum(vis.Y2016)
      .attr("class", "line")
      .attr("id", "line1")
      .attr("transform", "translate(" + 95 + "," + 0 + ")")
      .attr("d", vis.line)
      .style("fill", "none")
      .style("stroke", "green")
      .style("stroke-width", "2");

    vis.svg
      .append("path")
      .datum(vis.Y2017)
      .attr("class", "line")
      .attr("id", "line2")
      .attr("transform", "translate(" + 95 + "," + 0 + ")")
      .attr("d", vis.line)
      .style("fill", "none")
      .style("stroke", "orange")
      .style("stroke-width", "2");

    vis.svg
      .append("path")
      .datum(vis.Y2018)
      .attr("class", "line")
      .attr("id", "line3")
      .attr("transform", "translate(" + 95 + "," + 0 + ")")
      .attr("d", vis.line)
      .style("fill", "none")
      .style("stroke", "#ff00ff")
      .style("stroke-width", "2");

    vis.svg
      .append("path")
      .datum(vis.Y2019)
      .attr("class", "line")
      .attr("id", "line4")
      .attr("transform", "translate(" + 95 + "," + 0 + ")")
      .attr("d", vis.line)
      .style("fill", "none")
      .style("stroke", "#9999ff")
      .style("stroke-width", "2");

    var circles = vis.svg.selectAll("circle").data(vis.stateData);

    circles.exit().remove();

    circles
      .attr("cx", (d) => vis.xscale(d.Month))
      .attr("cy", (d) => vis.fatalScale(d.Total));

    circles
      .enter()
      .append("circle")
      .attr("cx", (d) => vis.xscale(d.Month))
      .attr("cy", (d) => vis.fatalScale(d.Total))
      .attr("transform", "translate(" + 95 + "," + 0 + ")")
      .attr("r", 5)
      .attr("fill", (d) => {
        if (d.Year == 2016) {
          return "green";
        } else if (d.Year == 2017) {
          return "orange";
        } else if (d.Year == 2018) {
          return "#ff00ff";
        } else {
          return "#9999ff";
        }
      })
      .on("mouseover", function (event, d) {
        vis.linetooltip
          .style("opacity", 1)
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + "px").html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 25px">
                 <p><b>No of Fatal Crashes:</b> ${d.Total}</p>      
                 <p><b>State:</b> ${d.State}</p>
                 <p><b>Month:</b> ${d.Month}</p>
                 <p><b>Year:</b> ${d.Year}</p>
            
         </div>`);
      })
      .on("mouseout", function (event, d) {
        vis.linetooltip
          .style("opacity", 0)
          .style("left", 0)
          .style("top", 0)
          .html(``);
      });
  }
}
