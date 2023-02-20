/* * * * * * * * * * * * * *
 *           MAIN           *
 * * * * * * * * * * * * * */

// init global variables & switches
let myDataTable,
  myMapVis,
  myBarVisOne,
  myBarVisTwo,
  myBrushVis,
  myPieChart,
  bubbleBar,
  bubbleChart,
  sPlot,
  bplot,
  bplot1,
  mysankeyChart,
  globalGraph;

let selectedTimeRange = [];
let selectedCategory = "population";
let selectedState = "";
let clickedState = "";
let mylineViz, mySelectedState;
let selectedMode = "relative";
let carouselIndex = 0;
let globalDataArray = [];
// load data using promises
let promises = [
  // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to ft your browser window
  d3.csv("data/fatal_year_2.csv"),
  d3.csv("data/shortData.csv"),
  d3.csv("data/statewise crashes monthly new 1.csv"),
  d3.csv("data/barData.csv"),
  d3.csv("data/US Accidents 2016-2019 40 thousand.csv"),
  d3.csv("data/StateCrashesPercentage.csv"),
  d3.json("data/sankey_edit.json"),
  d3.csv("data/USA crashes.csv"),
];

Promise.all(promises)
  .then(function (data) {
    console.log("STARTING OFF");

    globalDataArray = data;
    initMainPage(data);
  })
  .catch(function (err) {
    console.log(err);
  });

// initMainPage
function initMainPage(dataArray) {
  // log data
  console.log("check out the data", dataArray);

  // init table
  myDataTable = new DataTable("tableDiv", dataArray[1], dataArray[2]);

  // TODO - init map
  // myMapVis = new MapVis("mapDiv", dataArray[0], dataArray[1]);

  // TODO - init bars
  // myBarVisOne = new BarVis("topBarDiv", dataArray[1], dataArray[2], true);
  // myBarVisTwo = new BarVis("bottomBarDiv", dataArray[1], dataArray[2], false);

  // init brush

  //myBrushVis = new BrushVis("brushDiv", dataArray[1]);
}

let selectedPieCategory = document.getElementById("categorySelector").value;

function categoryChange() {
  selectedPieCategory = document.getElementById("categorySelector").value;
  myPieChart.wrangleData();
}

function modeChange() {
  selectedMode = document.getElementById("modeSelector").value;
  selectedTimeRange = [];

  myMapVis.wrangleData();
  myBarVisOne.wrangleData();
}

mySelectedState = document.getElementById("myCategorySelector").value;
function stateChange() {
  mySelectedState = document.getElementById("myCategorySelector").value;
  mylineViz.wrangleData();
}

$("#date-slider").slider({
  max: 48,
  min: 1,
  step: 1,
  slide: function (event, ui) {
    console.log("In the slider");
    let index = ui.value;

    sPlot.updateVis(sPlot.masterData, index);
  },
});
