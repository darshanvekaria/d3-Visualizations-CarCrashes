class SankeyChart {
  constructor(parentElement, data) {
    console.log(data);
    console.log("In constructor");
    this.data = data;
    this.parentElement = parentElement;
    this.initVis();
  }

  format(d) {}

  initVis() {
    let vis = this;

    vis.format = (d) => {
      let vis = this;
      return vis.formatNumber(d) + " " + vis.units;
    };

    vis.units = "%";

    vis.margin = { top: 10, right: 100, bottom: 40, left: 100 };

    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom;

    console.log("width", vis.width, "height", vis.height);

    // vis.width = 1200 - vis.margin.left - vis.margin.right;
    // vis.height = 740 - vis.margin.top - vis.margin.bottom;

    vis.formatNumber = d3.format(",.0f"); // zero decimal places
    vis.color = d3.scaleOrdinal(d3.schemeCategory10);

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

    // Set the sankey diagram properties
    vis.sankey = d3
      .sankey()
      .nodeWidth(15)
      .nodePadding(15)
      .size([vis.width, vis.height]);

    vis.path = vis.sankey.links();

    vis.makeVis();
  }

  makeVis() {
    let vis = this;

    vis.graph = vis.sankey(vis.data);
    vis.link = vis.svg
      .append("g")
      .selectAll(".link")
      .data(vis.graph.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function (d) {
        return d.width;
      });

    // add the link titles
    vis.link.append("title").text(function (d) {
      return d.source.name + " → " + d.target.name + "\n" + vis.format(d.value);
    });

    vis.node = vis.svg
      .append("g")
      .selectAll(".node")
      .data(vis.graph.nodes)
      .enter()
      .append("g")
      .attr("class", "node");

    vis.node
      .append("rect")
      .attr("x", function (d) {
        return d.x0;
      })
      .attr("y", function (d) {
        return d.y0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .attr("width", vis.sankey.nodeWidth())
      .style("fill", function (d) {
        return (d.color = vis.color(d.name.replace(/ .*/, "")));
      })
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function (d) {
        return d.name + "\n" + vis.format(d.value);
      });

    vis.node
      .append("text")
      .attr("x", function (d) {
        return d.x0 - 6;
      })
      .attr("y", function (d) {
        return (d.y1 + d.y0) / 2;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function (d) {
        return d.name + " " + vis.format(d.value);
      })
      .attr("font-size", "15px")
      .attr("font-weight", "700")
      .filter(function (d) {
        return d.x0 < vis.width / 2;
      })
      .attr("x", function (d) {
        return d.x1 + 6;
      })
      .attr("text-anchor", "start");
  }
}
