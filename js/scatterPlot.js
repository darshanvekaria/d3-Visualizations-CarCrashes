class ScatterPlot {
  constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = data;

    this.mainData = this.data;
    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.margin = { top: 10, right: 20, bottom: 30, left: 70 };

    // vis.height = 750 - vis.margin.top - vis.margin.bottom;
    // vis.width = 1000 - vis.margin.left - vis.margin.right;
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right -
      200;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom -
      150;

    vis.g = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom + 50)
      .append("g")
      .attr(
        "transform",
        "translate(" + vis.margin.left + ", " + vis.margin.top + ")"
      );

    vis.day_rectangle = vis.g
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", vis.width / 2)
      .attr("height", vis.height)
      .style("fill", "rgba(245, 242, 110, 0.1)");

    vis.night_rectangle = vis.g
      .append("rect")
      .attr("x", vis.width / 2)
      .attr("y", 0)
      .attr("width", vis.width)
      .attr("height", vis.height)
      .style("fill", "rgba(102, 51, 153, 0.1)");

    vis.x = d3
      .scaleLinear()
      .domain([0, 24])
      .range([0, vis.width + 15]);

    vis.y = d3.scaleLinear().domain([0, 170]).range([vis.height, 0]);

    vis.colorScheme = ["#75eab6", "#feafda", "#c6f25e", "#91cef4"];

    vis.colorScale = d3
      .scaleLinear()
      .domain([0, 102])
      .range(["orange", "rgb(207, 2, 2)"]);

    vis.textColorScale = d3
      .scaleLinear()
      .domain([0, 880])
      .range(["green", "orange"]);

    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x-axis")
      .attr("fill", "#274c56")
      .attr("transform", "translate(0, " + vis.height + ")");

    vis.yAxis = vis.g.append("g").attr("class", "y-axis").attr("fill", "red");

    vis.xAxisCall = d3
      .axisBottom(vis.x)
      .ticks(12)
      .tickFormat(function (d) {
        if (d < 12) return d + "AM";
        if (d == 12) return d + "PM";
        if (d == 24) return "11:59" + "PM";
        else return (d % 12) + "PM";
      });

    vis.xAxis
      .call(vis.xAxisCall)
      .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .style("fill", "green")
      .attr("font-size", "12px")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    vis.yAxisCall = d3
      .axisLeft(vis.y)
      .ticks(9)
      .tickFormat((d) => {
        return d;
      });

    vis.yAxis
      .call(vis.yAxisCall)
      .selectAll("text")
      .style("fill", "green")
      .attr("font-size", "12px");

    vis.index = 0;
    vis.interval;
    vis.countriesByYear;
    vis.accidentsByMonth;
    vis.masterData = [];

    // vis.tip = d3
    //   .tip()
    //   .attr("class", "d3-tip")
    //   .html((d) => {
    //     let tooltipText = "";

    //     tooltipText +=
    //       "<strong>Number of Accidents:</strong> <span style='color:#c6f25e'>" +
    //       d3.format(",.0f")(d.count) +
    //       "</span></br>";
    //     tooltipText +=
    //       "<strong>Hour of Day:</strong> <span style='color:#c6f25e'>" +
    //       d3.format(",.0f")(d.hour) +
    //       "</span></br>";

    //     return tooltipText;
    //   });
    // vis.g.call(vis.tip);

    vis.g
      .append("text")
      .attr("class", "x axis-label")
      .attr("x", vis.width / 4)
      .attr("y", 40)
      .attr("font-size", "24px")
      .attr("fill", "#aabad4")
      .attr("text-anchor", "end")
      .text("AM")
      .attr("font-weight", "bold")
      .style("fill", "rgba(50,50,50,0.3)");

    vis.g
      .append("text")
      .attr("class", "x axis-label")
      .attr("x", vis.width * 0.75)
      .attr("y", 40)
      .attr("font-size", "24px")
      .attr("fill", "#aabad4")
      .attr("text-anchor", "end")
      .text("PM")
      .attr("font-weight", "bold")
      .style("fill", "rgba(50,50,50,0.3)");

    vis.g
      .append("text")
      .attr("class", "x axis-label")
      .attr("x", vis.width / 2)
      .attr("y", vis.height + 75)
      .attr("font-size", "24px")
      .attr("fill", "#274c56")
      .attr("text-anchor", "middle")
      .text("Hour of Day")
      .style("fill", "steelblue");

    vis.g
      .append("text")
      .attr("class", "x axis-label")
      .attr("x", vis.width)
      .attr("y", vis.height - 5)
      .attr("font-size", "14px")
      .attr("fill", "#aabad4")
      .attr("text-anchor", "end")
      .text("Hours of the days in a month")
      .style("fill", "green");

    vis.g
      .append("text")
      .attr("class", "y axis-label")
      // .attr("x", -(vis.height / 8))
      .attr("x", -180)
      .attr("y", -40)
      .attr("font-size", "24px")
      .attr("fill", "#274c56")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Number of Car Accidents")
      .style("fill", "steelblue");

    vis.g
      .append("text")
      .attr("class", "y axis-label")
      .attr("x", -(vis.height / 2))
      .attr("y", +15)
      .attr("font-size", "14px")
      .attr("fill", "#aabad4")
      .attr("text-anchor", "start")
      .attr("transform", "rotate(-90)")
      .text("Frequency of crashes")
      .style("fill", "green");

    vis.wrangleData();
  }

  groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  wrangleData() {
    let vis = this;

    // console.log("Logging vis in wrabgle==>" + vis);
    console.log("main data", vis.data);
    vis.accidentsByMonth = vis.data.map((dataPoint) => {
      var obj = {};
      obj["date"] = new Date(dataPoint["Start_Time"].split(" ")[0]);
      obj["month"] =
        new Date(dataPoint["Start_Time"].split(" ")[0]).getMonth() + 1;
      obj["year"] = new Date(
        dataPoint["Start_Time"].split(" ")[0]
      ).getFullYear();
      obj["month-year"] = obj["month"] + "-" + obj["year"];
      obj["hour"] = +dataPoint["Start_Time"].split(" ")[1].split(":")[0];

      return obj;
    });

    console.log("converted data", vis.accidentsByMonth);
    vis.groupedData = vis.groupArrayOfObjects(
      vis.accidentsByMonth,
      "month-year"
    );
    for (let key in vis.groupedData) {
      var groupedByHour = vis.groupArrayOfObjects(vis.groupedData[key], "hour");
      vis.groupedData[key] = groupedByHour;
    }

    console.log("grouped data", vis.groupedData);

    for (let month in vis.groupedData) {
      let sub_array = [];
      for (let hour in vis.groupedData[month]) {
        hour = +hour;
        var temp_hour = {
          hour: +(hour + 1),
          count: vis.groupedData[month][hour].length,
        };

        sub_array.push(temp_hour);
      }

      let month_id = month.split("-")[0];
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let selectedMonthName = months[month_id - 1];
      let temp_month = {
        crashes: sub_array,
        month: month.split("-")[0],
        month_name: selectedMonthName + " " + month.split("-")[1],
      };

      vis.masterData.push(temp_month);
    }

    console.log("masterData", vis.masterData);
  }

  playChange() {
    let vis = this;
    vis.button = $("#play-button");

    if (vis.button.text() == "Play") {
      console.log("Inside play button");
      vis.button.text("Pause");
      vis.interval = setInterval(() => {
        vis.step(vis);
      }, 2000);
    } else {
      vis.button.text("Play");
      clearInterval(vis.interval);
    }
  }

  resetButtonChange() {
    console.log("INSIDE SCATTER");
    let vis = this;
    vis.index = 0;
    vis.updateVis(vis.masterData, 0);
  }

  //   $("#continent-select").on("change", () => {
  //     update(masterData, index);
  //   });

  //   // Add a slider selector for years
  //   $("#date-slider").slider({
  //     max: 12,
  //     min: 1,
  //     step: 1,
  //     slide: function (event, ui) {
  //       index = ui.value - 2;
  //       update(masterData, index);
  //     },
  //   });

  step(that) {
    // Loop for the interval
    let vis = that;
    console.log("Logging vis==>" + vis);
    console.log("Inside step");
    vis.index = vis.index < 48 ? vis.index + 1 : 0;
    this.updateVis(vis.masterData, vis.index);
  }

  updateVis(funcData, funcIndex) {
    let vis = this;
    vis.masterData = funcData;
    vis.index = funcIndex;

    // let vis = this;
    console.log("current index===>", vis.index);
    // Color scale

    vis.data = vis.masterData[vis.index].crashes;
    vis.total_crashes = 0;
    vis.data.forEach((d) => {
      vis.total_crashes += d.count;
    });
    console.log(vis.total_crashes);
    vis.years = vis.masterData[vis.index].month_name;
    vis.month = vis.masterData[vis.index].month;

    vis.t = d3.transition().duration(1000);
    vis.yearsLabel = vis.xAxis.selectAll("#yearsLabel").data(vis.years);

    vis.yearsLabel
      .enter()
      .append("text")
      .merge(vis.yearsLabel)

      .attr("id", "yearsLabel")
      .attr("x", vis.width)
      .attr("y", -vis.height * 0.75)
      .attr("font-size", "24px")
      .attr("text-anchor", "end")
      .attr("fill", "#aabad4")
      .text(vis.years)
      .style("fill", () => {
        return vis.textColorScale(vis.total_crashes);
      });

    vis.yearsLabel.exit().remove();

    vis.circles = vis.g.selectAll("circle").data(vis.data);

    vis.circles.exit().remove();

    vis.circles
      .enter()
      .append("circle")
      .style("fill", (d) => {
        return vis.colorScale(d.count);
      })
      .attr("stroke", "#000")
      .attr("stroke-width", 0.7)
      // .on("mouseover", vis.tip.show)
      // .on("mouseout", vis.tip.hide)
      // Update circles with incoming data
      .merge(vis.circles)
      .transition(vis.t)
      .attr("cx", (d) => {
        return vis.x(d.hour) - 2;
      })
      .attr("cy", (d) => {
        return vis.y(d.count) - 10;
      })
      .attr("r", (d) => {
        return 7;
      });
    // .attr("stroke", "darkred");

    vis.circles.style("fill", (d) => {
      return vis.colorScale(d.count);
    });

    vis.yearsLabel.text(vis.years).style("fill", () => {
      return vis.textColorScale(vis.total_crashes);
    });

    $("#year")[0].innerHTML = +vis.years;

    $("#date-slider").slider("value", +funcIndex);
  }
}
