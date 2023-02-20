/* * * * * * * * * * * * * *
 *      class BarVis        *
 * * * * * * * * * * * * * */

class BarVis {
  constructor(parentElement, covidData, usaData, descending) {
    this.parentElement = parentElement;
    this.covidData = covidData;
    this.usaData = usaData;
    this.displayData = [];
    this.descending = descending;
    this.parseDate = d3.timeParse("%m/%d/%Y");
    this.initVis();
    // console.log("entered bar");
  }

  initVis() {
    let vis = this;
    // this.fatal_processed = {};
    this.fatal_processed = {};
    this.fatal_processed_new = [];
    vis.margin = { top: 20, right: 40, bottom: 20, left: 50 };
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right -
      100;
    vis.height =
      document.getElementById(vis.parentElement).getBoundingClientRect()
        .height -
      vis.margin.top -
      vis.margin.bottom -
      50;

    console.log("bar height and width =>-----", vis.height, vis.width);

    // init drawing area
    vis.place_x = 100;
    vis.place_y = 100;
    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")

      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`)
      .attr("height", vis.height + vis.margin.top + vis.margin.top)
      .append("g")
      .attr(
        "transform",
        `translate (${vis.margin.left + 20}, ${vis.margin.top})`
      );

    // add title
    vis.bar_title = "Fatal Rate Per 10,000 Population";

    if (this.descending == false) vis.bar_title = "Bottom 10 States";
    vis.title = vis.svg
      .append("g")
      .attr("class", "title")
      .append("text")
      // .text(vis.bar_title)
      .attr("transform", `translate(${vis.width / 2}, -10)`)
      .attr("text-anchor", "middle");

    vis.x_title = vis.svg
      .append("g")
      .attr("class", "title")
      .append("text")
      .text("Fatality Rate")
      .attr("x", -130)
      .attr("y", -55)
      .attr("transform", "rotate(-90)");

    // tooltip
    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "barTooltip");

    //barchart work
    vis.xScale = d3.scaleBand().range([0, vis.width]).padding(0.5);
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    vis.bottom_axis = vis.svg
      .append("g")
      .attr("transform", "translate(2," + vis.height + ")");
    vis.left_axis = vis.svg.append("g").attr("transform", "translate(0,0)");

    //bar chart works ends

    //color work
    vis.colorScale = d3
      .scaleLinear()
      .range(["rgb(139, 205, 206)", "rgb(139, 205, 206)"]);

    this.wrangleData();
  }

  wrangleData() {
    let vis = this;
    // Pulling this straight from dataTable.js
    let filteredData = [];

    // if there is a region selected
    if (selectedTimeRange.length !== 0) {
      //console.log('region selected', vis.selectedTimeRange, vis.selectedTimeRange[0].getTime() )

      // iterate over all rows the csv (dataFill)
      vis.covidData.forEach((row) => {
        // and push rows with proper dates into filteredData
        if (
          selectedTimeRange.length !== 0
          // selectedTimeRange[0].getTime() <=
          //   vis.parseDate(row.submission_date).getTime() &&
          // vis.parseDate(row.submission_date).getTime() <=
          //   selectedTimeRange[1].getTime()
        ) {
          filteredData.push(row);
        }
      });
    } else {
      filteredData = vis.covidData;
    }

    // prepare covid data by grouping all rows by state
    let covidDataByState = Array.from(
      d3.group(filteredData, (d) => d.state),
      ([key, value]) => ({ key, value })
    );

    // init final data structure in which both data sets will be merged into
    vis.stateInfo = [];

    // merge
    covidDataByState.forEach((state) => {
      // get full state name
      let stateName = nameConverter.getFullName(state.key);

      // init counters
      let newCasesSum = 0;
      let newDeathsSum = 0;
      let population = 0;

      // look up population for the state in the census data set
      vis.usaData.forEach((row) => {
        if (row.state === stateName) {
          population += +row["2020"].replaceAll(",", "");
        }
      });

      // calculate new cases by summing up all the entries for each state
      state.value.forEach((entry) => {
        newCasesSum += +entry["new_case"];
        newDeathsSum += +entry["new_death"];
      });

      // populate the final data structure
      vis.stateInfo.push({
        state: stateName,
        population: population,
        absCases: newCasesSum,
        absDeaths: newDeathsSum,
        relCases: (newCasesSum / population) * 100,
        relDeaths: (newDeathsSum / population) * 100,
      });
    });
    // TODO: Sort and then filter by top 10
    // maybe a boolean in the constructor could come in handy ?

    if (vis.descending) {
      vis.stateInfo.sort((a, b) => {
        return b[selectedCategory] - a[selectedCategory];
      });
    } else {
      vis.stateInfo.sort((a, b) => {
        return a[selectedCategory] - b[selectedCategory];
      });
    }

    //console.log("final data structure", vis.stateInfo);

    vis.fullStateInfo = vis.stateInfo;

    if (selectedCategory == "relCases" || "relDeaths") {
      vis.stateInfo = vis.stateInfo.filter((d) => {
        if (d.population == 0) return false;
        return true;
      });
    }

    vis.topTenData = vis.stateInfo.slice(0, 10);

    console.log("top ten", this.topTenData);

    if (selectedMode == "absolute") {
      // while (vis.fatal_processed.length > 0) {
      //   //Clear the current dataset
      //   vis.fatal_processed.pop();
      // }
      vis.fatal_processed["2016"] = { state: 2016, population: 37806 };
      vis.fatal_processed["2017"] = { state: 2017, population: 37473 };
      vis.fatal_processed["2018"] = { state: 2018, population: 36835 };
      vis.fatal_processed["2019"] = { state: 2019, population: 36096 };
    } else {
      // while (vis.fatal_processed.length > 0) {
      //   //Clear the current dataset
      //   vis.fatal_processed.pop();
      // }
      vis.fatal_processed["2016"] = {
        state: 2016,
        population: 37806 / 32294,
      };
      vis.fatal_processed["2017"] = { state: 2017, population: 37473 / 32498 };
      vis.fatal_processed["2018"] = { state: 2018, population: 36835 / 32668 };
      vis.fatal_processed["2019"] = {
        state: 2019,
        population: 36096 / 32824,
      };
    }

    console.log(vis.fatal_processed);

    vis.topTenData = Object.values(vis.fatal_processed);

    if (selectedMode == "absolute") {
      while (vis.fatal_processed_new.length > 0) {
        //Clear the current dataset
        vis.fatal_processed_new.pop();
      }
      vis.fatal_processed_new.push(37806);
      vis.fatal_processed_new.push(36835);
      vis.fatal_processed_new.push(37473);
      vis.fatal_processed_new.push(36096);
    } else {
      while (vis.fatal_processed_new.length > 0) {
        //Clear the current dataset
        vis.fatal_processed_new.pop();
      }
      vis.fatal_processed_new.push(37806 / 322941);
      vis.fatal_processed_new.push(37473 / 324986);
      vis.fatal_processed_new.push(36835 / 326688);
      vis.fatal_processed_new.push(36096 / 328240);
    }

    // console.log("final data structure", vis.topTenData);

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    //color scale work
    vis.attribute = "population";
    //console.log(vis.attribute);
    vis.min_value = d3.min(Object.values(vis.fullStateInfo), (d) => {
      //console.log(d);
      if (d.population == 0) return 0;
      return d[vis.attribute];
    });
    vis.max_value = d3.max(Object.values(vis.fullStateInfo), (d) => {
      if (d.population == 0) return 0;
      return d[vis.attribute];
    });
    //console.log(vis.min_value);
    if (vis.min_value == -Infinity) {
      vis.min_value = 0;
    }

    //  console.log(vis.max_value);
    vis.colorScale.domain([vis.min_value, vis.max_value]);

    //color scale work ends

    vis.xScale.domain(
      Object.values(vis.fatal_processed).map(function (d) {
        return d.state;
      })
    );
    //vis.xScale.domain(d3.range(vis.fatal_processed_new.length));
    vis.yScale.domain([
      0,
      d3.max(vis.topTenData, function (d) {
        // console.log(d[selectedCategory]);
        return d[selectedCategory];
      }),
    ]);

    vis.bottom_axis
      .attr("id", "bot-axis")
      .call(d3.axisBottom(vis.xScale).tickSize(0))
      .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .style("fill", "steelblue")
      .attr("font-size", "24px")
      .attr("class", "x-axis")
      .attr("dy", ".35em");
    // .selectAll("text")
    // .attr("y", 5)
    // .attr("x", 26)
    // .attr("dy", "0.5em")
    // .attr("transform", "rotate(45)")
    // .style("text-anchor", "end");
    vis.left_axis
      .call(
        d3
          .axisLeft(vis.yScale)
          // .tickFormat(function (d) {
          //   return +d;
          // })
          .ticks(8)
      )
      .selectAll("text")
      .style("fill", "steelblue")
      .attr("font-size", "24px")
      .attr("class", "y-axis")

      .attr("y", 0)
      .attr("dy", "0.71em");

    vis.bars = vis.svg
      .selectAll("rect")
      .data(Object.values(vis.fatal_processed), (d) => {
        return d.population;
      });

    vis.t = d3.transition().duration(1000).attr("height", 0);

    vis.bars
      .enter()

      .append("rect")
      .attr("class", "bar")

      .attr("x", function (d) {
        // position in x-axis
        return vis.xScale(d.state); // we will pass the values from the dataset
      })

      .attr("y", function (d) {
        // return vis.yScale(d.population);

        return vis.yScale(d.population);
      })
      .on("mouseover", function (event, d) {
        d3.select(this)
          // .attr("stroke-width", "2px")
          .attr("stroke", "black")
          .attr("fill", "rgb(183, 226, 252)");

        vis.tooltip
          .style("opacity", 1)
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY - 120 + "px").html(`
       <div style="border: thin solid black; border-radius: 5px; background: black; padding: 20px;">
           <h6 style="opacity:1; color:white"> ${d.state}</h6>
           <p style="opacity:1; color:white">  ${
             selectedMode == "absolute" ? "Fatal Crashes" : "Fatality Rate"
           }: ${selectedMode == "absolute" ? d.population : d.population.toFixed(2)}
          </p>

       </div>`);
      })

      .on("mouseout", function (event, d) {
        d3.select(this)
          .attr("stroke-width", "0px")
          .attr("fill", (d) => {
            return vis.colorScale(d[selectedCategory]);
          });

        vis.tooltip
          .style("opacity", 0)
          .style("left", 0)
          .style("top", 0)
          .html(``);
      })

      .merge(vis.bars)
      .transition(vis.t)
      .attr("width", vis.xScale.bandwidth())

      .attr("height", function (d) {
        return vis.height - vis.yScale(d.population);
      })

      .style("fill", (d) => {
        console.log("filling colours==>", vis.colorScale(d.population));
        return vis.colorScale(d.population);
      });

    vis.bars
      .exit()
      .transition()
      .duration(1000)
      .attr("height", 0)
      .attr("y", function (d) {
        // return vis.yScale(d.population);

        return vis.yScale(d.population);
      })
      .remove();

    if (selectedMode == "absolute") {
      vis.bar_title = "Total fatalities for USA";
      vis.x_title.text("Total Fatalities");
    } else {
      vis.x_title.text("Fatality Rate");
      vis.bar_title = "Fatality Rate Per 10,000 Population";
    }

    vis.title.text(vis.bar_title);

    //vis.bars
    // .on("mouseover", function (event, d) {
    //   d3.select(this)
    //     // .attr("stroke-width", "2px")
    //     .attr("stroke", "black")
    //     .attr("fill", "rgb(183, 226, 252)");

    //   vis.tooltip
    //     .style("opacity", 1)
    //     .style("left", event.pageX + 20 + "px")
    //     .style("top", event.pageY - 120 + "px").html(`
    //  <div style="border: thin solid black; border-radius: 5px; background: black; padding: 20px;">
    //      <h6 style="opacity:1; color:white"> ${d.state}</h6>
    //      <p style="opacity:1; color:white"> Fatal Crashes: ${d.population}
    //     </p>

    //  </div>`);
    // })

    // .on("mouseout", function (event, d) {
    //   d3.select(this)
    //     .attr("stroke-width", "0px")
    //     .attr("fill", (d) => {
    //       return vis.colorScale(d[selectedCategory]);
    //     });

    //   vis.tooltip
    //     .style("opacity", 0)
    //     .style("left", 0)
    //     .style("top", 0)
    //     .html(``);
    // });

    // console.log(vis.xScale("California"));
    // console.log("here");
  }
}
