/* * * * * * * * * * * * * *
 *         PieChart         *
 * * * * * * * * * * * * * */

class BubbleChart {
  // constructor method to initialize Timeline object
  constructor(parentElement, data) {
    this.data = data;
    this.parentElement = parentElement;
    this.circleColors = ["#b2182b", "#d6604d", "#f4a582", "#fddbc7"];

    // call initVis method
    this.specialVis();
  }

  specialVis() {
    let vis = this;

    // margin conventions
    vis.margin = { top: 10, right: 0, bottom: 0, left: 10 };
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom;

    // init drawing area
    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width)
      .attr("height", vis.height)
      .append("g");

    // let height = 100;
    // let width = 100;

    let height = vis.height;
    let width = vis.width;

    // let height = 80;
    // let width = 80;
    let radius = 5;
    let step = radius * 3;

    let theta = Math.PI * (3 - Math.sqrt(5));

    let states = ["VA", "MA", "KN", "CAL", "FL", "PA", "OR", "IN", "TX", "AZ"];
    let pop = 10;
    let data = Array.from({ length: 10 }, (_, i) => {
      const r = step * Math.sqrt((i += 0.5)),
        a = theta * i;
      pop += 1;
      return [width / 2 + r * Math.cos(a), height / 2 + r * Math.sin(a), pop];
    });

    data.sort((a, b) => {
      return a[2] - b[2];
    });
    console.log("bubble data", data);
    data[0].push("Vermont : 19%");
    data[1].push("Alaska : 21%");
    data[2].push("North Carolina : 22%");
    data[3].push("Wisconsin : 24%");
    data[4].push("Kansas : 28%");
    data[5].push("California : 29%");
    data[6].push("Idaho : 30%");
    data[7].push("Montana : 31%");
    data[8].push("North Dakota : 34%");
    data[9].push("Wyoming : 38%");

    let currentTransform = [width / 4, height / 2, height];

    const g = vis.svg.append("g");

    vis.colorScale = d3.scaleOrdinal().range(["lightpurple", "purple"]);
    vis.colorScale.domain([1, pop]);

    var elem = g.selectAll("g myCircleText").data(data);
    /*Create and place the "blocks" containing the circle and the text */
    var elemEnter = elem
      .enter()
      .append("g")
      .attr("class", "node-group")
      .attr("transform", function ([x]) {
        return "translate(0,0)";
      });
    /*Create the circle for each block */
    var circleInner = elemEnter.append("circle").attr("r", function (d) {
      return d[0];
    });

    var circleOuter = elemEnter
      .append("circle")
      .attr("r", function (d) {
        return d[2];
      })
      .attr("fill", (d) => {
        let rgb_temp = d3.interpolateRainbow(d[2] / 10);
        let rgb_nums = rgb_temp.substring(4, rgb_temp.length - 1);
        let main_rgb = "rgba(" + rgb_nums + ", 1)";
        console.log("rgb temp ====>", main_rgb);

        return main_rgb;
      });
    /* Create the text for each block */
    elemEnter
      .append("text")
      .text(function (d) {
        return d[3];
      })
      .attr("x", ([x]) => x * 2 - 10)
      .attr("y", ([, y]) => y * 1.5)
      .attr("fill", "black")
      .attr("font-size", (d) => {
        console.log(d[2]);
        if (d[3] == "North Carolina : 22%") return d[2] / 6;
        if (d[3] == "North Dakota : 34%") return d[2] / 6;
        if (d[3] == "California : 29%") return d[2] / 6;
        if (d[3] == "Wyoming : 38%") return d[2] / 6;
        if (d[3] == "Wisconsin : 24%") return d[2] / 6;
        if (d[3] == "Montana : 31%") return d[2] / 6;

        return d[2] / 4;
      })
      .attr({
        dy: function (d) {
          return d[2];
        },
      });

    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", ([x]) => x * 2)
      .attr("cy", ([, y]) => y * 1.5)
      .attr("r", (data) => {
        console.log(data);
        return data[2];
      })
      .attr("fill", (d, i) => {
        let rgb_temp = d3.interpolateRainbow(d[2] / 10);
        let rgb_nums = rgb_temp.substring(4, rgb_temp.length - 1);
        let main_rgb = "rgba(" + rgb_nums + ", 1)";
        console.log("rgb temp ====>", main_rgb);

        return main_rgb;
      })
      .append("text")
      .text("Testing")
      .attr("fill", "red");

    function transition() {
      const d = data[Math.floor(Math.random() * data.length)];
      const i = d3.interpolateZoom(currentTransform, [...d, radius * 2 + 1]);

      g.transition()
        .delay(250)
        .duration(i.duration)
        .attrTween("transform", () => (t) => {
          return transform((currentTransform = i(t)));
        })
        .on("end", transition);
    }

    function transform([x, y, r]) {
      return `
      translate(${width / 2}, ${height / 2})
      scale(${(height / (0.5 * r)) * 0.1})
   translate(${-x * 2}, ${-y * 1.5})
    `;
    }

    vis.svg.call(transition);
  }

  // wrangleData method
}
