/* * * * * * * * * * * * * *
 *          MapVis          *
 * * * * * * * * * * * * * */

class MapVis {
  constructor(parentElement, geoData, fatalData) {
    this.parentElement = parentElement;
    this.displayData = [];
    this.geoData = geoData;
    this.fatalData = fatalData;
    console.log("base data", this.fatalData);

    this.colors = ["#fddbc7", "#f4a582", "#d6604d", "#b2182b"];

    // parse date method
    this.parseDate = d3.timeParse("%m/%d/%Y");

    this.initMap();
  }

  initMap() {
    let vis = this;

    vis.margin = { top: 20, right: 50, bottom: 20, left: 50 };
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom;

    setTimeout(() => {
      console.log(
        "MAIN HEIGHT ====>>>",
        document.getElementById(vis.parentElement).getBoundingClientRect()
          .height -
          vis.margin.top -
          vis.margin.bottom
      );
    }, 5000);

    console.log("height and width =>-----", vis.height, vis.width);

    vis.colorScale = d3
      .scaleLinear()
      .range(["rgb(247, 229, 24)", "rgb(238, 63, 44)"]);

    // SVG drawing area
    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + (vis.margin.left - 20) + "," + vis.margin.top + ")"
      );

    //legend work
    vis.legend = vis.svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${(vis.width * 2) / 4}, ${vis.height - 40})`
      );

    vis.colors = ["rgb(247, 229, 24)", "rgb(238, 63, 44)"];

    vis.grad = vis.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "grad")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    //legend work ends

    vis.path = d3.geoPath();

    vis.viewpoint = { width: 900, height: 700 };
    vis.width_zoom = vis.width / vis.viewpoint.width;
    vis.height_zoom = vis.height / vis.viewpoint.height;

    vis.states = vis.svg
      .append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(vis.geoData, vis.geoData.objects.states).features)
      .enter()
      .append("path")
      .attr("d", vis.path)
      .attr("transform", `scale(${vis.width_zoom} ${vis.height_zoom})`);

    //names work
    vis.nc = new NameConverter();

    vis.state_names = {};
    vis.names_data = topojson.feature(
      vis.geoData,
      vis.geoData.objects.states
    ).features;
    this.names_data.forEach(function (d, i) {
      vis.state_names[d.id] = d.properties.name;
    });

    vis.stateNames = vis.svg
      .append("g")
      .attr("class", "states-names")
      .selectAll("text")
      .data(this.names_data)
      .enter()
      .append("svg:text")
      .text(function (d) {
        // return "TESTING";

        return vis.nc.getAbbreviation(vis.state_names[d.id]);
      })
      .attr("x", function (d) {
        return vis.path.centroid(d)[0];
      })
      .attr("y", function (d) {
        return vis.path.centroid(d)[1];
      })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("cursor", "pointer")
      .style("font", "20px times")
      .attr("transform", `scale(${vis.width_zoom} ${vis.height_zoom})`)
      .on("click", function (event, d) {
        clickedState = d.properties.name;
        console.log(clickedState);
      });

    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "pieTooltip");

    //bounds work begins

    vis.lower_bound = vis.svg
      .attr("class", "title")
      .attr("id", "lower-bound")
      .append("text");

    vis.upper_bound = vis.svg
      .attr("class", "title")
      .attr("id", "upper-bound")
      .append("text");

    // vis.g = vis.svg.append("g");

    // vis.text = vis.g.selectAll("lower").data([vis.min_value, vis.max_value]);

    // vis.text.attr("class", "lower");
    // vis.text
    //   .enter()
    //   .append("text")
    //   .attr("x", vis.width / 2)
    //   .attr("y", vis.height)
    //   .merge(vis.text);

    //bounds work
    vis.map_title = vis.svg
      .append("g")
      .attr("class", "title")
      .append("text")
      .text("Brush over to select specific years")
      .attr("transform", `translate(${vis.width / 2}, 0)`)
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .style("fill", "black");

    vis.map_hint = vis.svg
      .append("g")
      .attr("class", "title")
      .append("text")
      .text("Hover to explore values")
      .attr("transform", `translate(${0}, ${vis.height})`)
      .attr("font-size", "15px")
      .style("fill", "gray");
    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    // check out the data
    // console.log(vis.covidData)
    // console.log(vis.usaData)

    // first, filter according to selectedTimeRange, init empty array
    let filteredData = [];

    vis.fatalInfo = {};

    // if there is a region selected
    if (selectedTimeRange.length !== 0) {
      vis.fatalInfo = {};
      vis.fatalData.forEach((d) => {
        if (d.State == "USA") return;
        if (selectedMode == "relative") {
          d["2016_r"] = +d["2016_r"];
          d["2017_r"] = +d["2017_r"];
          d["2018_r"] = +d["2018_r"];
          d["2019_r"] = +d["2019_r"];
          d["total"] = 0;
          for (let i = selectedTimeRange[0]; i <= selectedTimeRange[1]; i++) {
            d["total"] += d["" + i + "_r"];
          }
        } else {
          d["2016"] = +d["2016"];
          d["2017"] = +d["2017"];
          d["2018"] = +d["2018"];
          d["2019"] = +d["2019"];
          d["total"] = 0;
          for (let i = selectedTimeRange[0]; i <= selectedTimeRange[1]; i++) {
            d["total"] += d["" + i];
          }
        }

        vis.fatalInfo[d.State] = d;
      });
    } else {
      vis.fatalInfo = {};
      vis.fatalData.forEach((d) => {
        if (d.State == "USA") return;
        if (selectedMode == "relative") {
          if (d.State == "Alabama") {
            console.log("alabama shit=>");

            var x = parseFloat(d["2016"]);
            var y = parseFloat(d["2016_p"]);
            console.log(typeof x, typeof y);
            console.log(x, y);
            console.log(parseFloat(x) / parseFloat(y));
          }
          d["2016_r"] = +d["2016_r"];
          d["2017_r"] = +d["2017_r"];
          d["2018_r"] = +d["2018_r"];
          d["2019_r"] = +d["2019_r"];
          d["total"] = d["2016_r"] + d["2017_r"] + d["2018_r"] + d["2019_r"];
        } else {
          console.log("inside default branch");
          d["2016"] = +d["2016"];
          d["2017"] = +d["2017"];
          d["2018"] = +d["2018"];
          d["2019"] = +d["2019"];
          d["total"] = d["2016"] + d["2017"] + d["2018"] + d["2019"];
        }

        vis.fatalInfo[d.State] = d;
      });

      vis.min_value = d3.min(Object.values(vis.fatalInfo), (d) => {
        return d.total;
      });
      vis.max_value = d3.max(Object.values(vis.fatalInfo), (d) => {
        return d.total;
      });

      console.log("prev step data", vis.fatalData);
      console.log("current data =>>>>", vis.fatalInfo);
    }

    // prepare covid data by grouping all rows by state

    // console.log("covidbystate");
    // console.log(covidDataByState);

    // init final data structure in which both data sets will be merged into
    vis.stateInfo = {};

    //for color scale
    vis.min_relative_cases = 100;
    vis.max_relative_cases = 0;

    // merge

    //  console.log("final data structure for mapVis ", vis.stateInfo);

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    if (selectedMode == "absolute") {
      vis.map_title
        .text("Heat Map : Total fatalities for USA")
        .attr("font-size", "22px")
        .attr("font-weight", "700")
        .style("fill", "steelblue");
    } else {
      vis.map_title
        .text("Heat Map : Fatality Rate Per 10,000 Population")
        .attr("font-size", "22px")
        .attr("font-weight", "700")
        .style("fill", "steelblue");
    }
    //color scale work
    vis.attribute = "relCases";

    vis.colorScale.domain([vis.min_value, vis.max_value]);
    console.log(vis.min_value, vis.max_value);

    //color scale work ends

    //legend work
    vis.legendColors = [];
    Object.values(vis.fatalInfo).forEach((d) => {
      //console.log(vis.colorScale(d[vis.attribute]));
      vis.legendColors.push(d.total);
    });
    vis.legendColors.sort(function (a, b) {
      return a - b;
    });

    for (let i = 0; i < vis.legendColors.length; i++) {
      vis.legendColors[i] = vis.colorScale(vis.legendColors[i]);
    }

    vis.grad
      .selectAll("stop")
      .data(vis.colors)
      .enter()
      .append("stop")
      .style("stop-color", function (d) {
        return d;
      })
      .attr("offset", function (d, i) {
        return 100 * (i / (vis.colors.length - 1)) + "%";
      });

    vis.svg
      .append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", vis.width / 2 - 20)
      .attr("height", 20)
      .style("fill", "url(#grad)")
      .attr(
        "transform",
        `translate(${(vis.width * 2) / 4}, ${vis.height - 40})`
      );

    vis.lower_bound
      .text(Math.round(vis.min_value * 100) / 100)
      .attr("transform", `translate(${(vis.width * 2) / 4}, ${vis.height + 5})`)
      .attr("text-anchor", "middle")
      .style("font-size", "14px");

    vis.upper_bound
      .text(Math.round(vis.max_value * 100) / 100)
      .attr("transform", `translate(${(vis.width * 2) / 2}, ${vis.height + 5})`)
      .attr("text-anchor", "middle")
      .style("font-size", "14px");

    //legend ends
    // TODO
    vis.states
      .style("fill", (d) => {
        // console.log(vis.stateInfo[d.properties.name]);
        return vis.colorScale(vis.fatalInfo[d.properties.name].total);
      })
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", "2px")
          .attr("stroke", "black")
          .attr("fill", "rgba(173,222,255,0.62)");

        vis.tooltip
          .style("opacity", 0.8)
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY - 120 + "px").html(`
         <div style="border: thin solid white; border-radius: 5px; background: black; padding: 20px; ">
             <h5 style="opacity:1; color:white"> ${d.properties.name}</h5>
       
              <h6 style="opacity:1; color:white"> ${
                selectedMode == "absolute" ? "Fatal Crashes" : "Fatality Rate"
              }: ${selectedMode == "absolute" ? vis.fatalInfo[d.properties.name].total : vis.fatalInfo[d.properties.name].total.toFixed(2)}</h6>   
                       
         </div>`);
      })

      .on("mouseout", function (event, d) {
        d3.select(this)
          .attr("stroke-width", "0px")
          .attr("fill", (d) => {});

        vis.tooltip
          .style("opacity", 0)
          .style("left", 0)
          .style("top", 0)
          .html(``);
      })
      .on("click", function (event, d) {
        clickedState = d.properties.name;
        console.log(clickedState);
      });
  }
}
