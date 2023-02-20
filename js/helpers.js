/* * * * * * * * * * * * * *
 *      NameConverter       *
 * * * * * * * * * * * * * */

class NameConverter {
  constructor() {
    this.original_states = [
      ["Alabama", "AL"],
      ["Alaska", "AK"],
      ["American Samoa", "AS"],
      ["Arizona", "AZ"],
      ["Arkansas", "AR"],
      ["Armed Forces Americas", "AA"],
      ["Armed Forces Europe", "AE"],
      ["Armed Forces Pacific", "AP"],
      ["California", "CA"],
      ["Colorado", "CO"],
      ["Connecticut", "CT"],
      ["Delaware", ""],
      ["District of Columbia", "DC"],
      ["Florida", "FL"],
      ["Georgia", "GA"],
      ["Guam", "GU"],
      ["Hawaii", "HI"],
      ["Idaho", "ID"],
      ["Illinois", "IL"],
      ["Indiana", "IN"],
      ["Iowa", "IA"],
      ["Kansas", "KS"],
      ["Kentucky", "KY"],
      ["Louisiana", "LA"],
      ["Maine", "ME"],
      ["Marshall Islands", "MH"],
      ["Maryland", "MD"],
      ["Massachusetts", "MA"],
      ["Michigan", "MI"],
      ["Minnesota", "MN"],
      ["Mississippi", "MS"],
      ["Missouri", "MO"],
      ["Montana", "MT"],
      ["Nebraska", "NE"],
      ["Nevada", "NV"],
      ["New Hampshire", ""],
      ["New Jersey", "NJ"],
      ["New Mexico", "NM"],
      ["New York", "NY"],
      ["North Carolina", "NC"],
      ["North Dakota", "ND"],
      ["Northern Mariana Islands", "NP"],
      ["Ohio", "OH"],
      ["Oklahoma", "OK"],
      ["Oregon", "OR"],
      ["Pennsylvania", "PA"],
      ["Puerto Rico", "PR"],
      ["Rhode Island", "RI"],
      ["South Carolina", "SC"],
      ["South Dakota", "SD"],
      ["Tennessee", "TN"],
      ["Texas", "TX"],
      ["US Virgin Islands", "VI"],
      ["Utah", "UT"],
      ["Vermont", "VT"],
      ["Virginia", "VA"],
      ["Washington", "WA"],
      ["West Virginia", "WV"],
      ["Wisconsin", "WI"],
      ["Wyoming", "WY"],
    ];
    this.states = [
      ["Alabama", "AL"],
      ["Alaska", "AK"],
      ["American Samoa", "AS"],
      ["Arizona", "AZ"],
      ["Arkansas", "AR"],
      ["Armed Forces Americas", "AA"],
      ["Armed Forces Europe", "AE"],
      ["Armed Forces Pacific", "AP"],
      ["California", "CA"],
      ["Colorado", "CO"],
      ["Connecticut", "CT"],
      ["Delaware", ""],
      ["District of Columbia", "DC"],
      ["Florida", "FL"],
      ["Georgia", "GA"],
      ["Guam", "GU"],
      ["Hawaii", "HI"],
      ["Idaho", "ID"],
      ["Illinois", "IL"],
      ["Indiana", "IN"],
      ["Iowa", "IA"],
      ["Kansas", "KS"],
      ["Kentucky", "KY"],
      ["Louisiana", "LA"],
      ["Maine", "ME"],
      ["Marshall Islands", "MH"],
      ["Maryland", ""],
      ["Massachusetts", "MA"],
      ["Michigan", "MI"],
      ["Minnesota", "MN"],
      ["Mississippi", "MS"],
      ["Missouri", "MO"],
      ["Montana", "MT"],
      ["Nebraska", "NE"],
      ["Nevada", "NV"],
      ["New Hampshire", ""],
      ["New Jersey", "NJ"],
      ["New Mexico", "NM"],
      ["New York", "NY"],
      ["North Carolina", "NC"],
      ["North Dakota", "ND"],
      ["Northern Mariana Islands", "NP"],
      ["Ohio", "OH"],
      ["Oklahoma", "OK"],
      ["Oregon", "OR"],
      ["Pennsylvania", "PA"],
      ["Puerto Rico", "PR"],
      ["Rhode Island", ""],
      ["South Carolina", "SC"],
      ["South Dakota", "SD"],
      ["Tennessee", "TN"],
      ["Texas", "TX"],
      ["US Virgin Islands", "VI"],
      ["Utah", "UT"],
      ["Vermont", "VT"],
      ["Virginia", "VA"],
      ["Washington", "WA"],
      ["West Virginia", "WV"],
      ["Wisconsin", "WI"],
      ["Wyoming", "WY"],
    ];
  }

  getAbbreviation(input) {
    let that = this;
    let output = "";
    that.states.forEach((state) => {
      if (state[0] === input) {
        output = state[1];
      }
    });
    return output;
  }

  getFullName(input) {
    let that = this;
    let output = "";
    that.states.forEach((state) => {
      if (state[1] === input) {
        output = state[0];
      }
    });
    return output;
  }
}

let nameConverter = new NameConverter();

/* * * * * * * * * * * * * *
 *         Carousel         *
 * * * * * * * * * * * * * */

// Create bootsrap carousel, disabling rotating
let carousel = new bootstrap.Carousel(
  document.getElementById("stateCarousel"),
  { interval: false }
);

// on button click switch view
function switchView() {
  if (carouselIndex < 14) {
    carousel.next();
    carouselIndex++;
    if (carouselIndex == 0) {
      $("#main_title").text("Car Crashes Across All States In The U.S.");
    }
    if (carouselIndex == 1) {
      ("Car Crash Fatalities Across All States In The U.S.");
    }
    if (carouselIndex == 2) {
      $("#main_title").text("Types of vehicles involved in accidents");
    }
    if (carouselIndex == 3) {
      $("#main_title").text("Types of vehicles involved in accidents");
    }
    if (carouselIndex == 4) {
      $("#main_title").text("Effect of weather on car accidents");
    }
    if (carouselIndex == 5) {
      $("#main_title").text("Effect of weather on car accidents");
    }
    if (carouselIndex == 6) {
      $("#main_title").text("Car crashes in each month 2016-2019");
    }
    if (carouselIndex == 7) {
      $("#main_title").text("Car crashes in each month 2016-2019");
    }
    if (carouselIndex == 8) {
      $("#main_title").text("Hourly Distribution of Car Crashes");
    }
    if (carouselIndex == 9) {
      $("#main_title").text("Hourly Distribution of Car Crashes");
    }
    if (carouselIndex == 10) {
      $("#main_title").text("Effect of Alcohol on Car Accidents");
    }
    if (carouselIndex == 11) {
      $("#main_title").text("Effect of Alcohol on Car Accidents");
    }
    if (carouselIndex == 12) {
      $("#main_title").text("Key Findings");
    }
    if (carouselIndex == 13) {
      $("#main_title").text("Main Message");
    }
    if (carouselIndex == 14) {
      $("#main_title").text("The End");
    }
    if (carouselIndex == 1 && !myMapVis) {
      myMapVis = new MapVis("mapDiv", globalDataArray[0], globalDataArray[1]);
      $("#main_title").text("Car Crashes Across All States In The U.S.");
    }
    if (carouselIndex == 1 && !myBarVisOne) {
      myBarVisOne = new BarVis(
        "scatterDiv",
        globalDataArray[1],
        globalDataArray[2],
        true
      );
    }

    if (carouselIndex == 1 && !myBrushVis) {
      myBrushVis = new BrushVis("brushDiv", globalDataArray[1]);
      myBrushVis.initVis();
    }

    if (carouselIndex == 2) {
      $("#main_title").text("Types of vehicles involved in accidents");
    }

    if (carouselIndex == 3 && !mysankeyChart) {
      mysankeyChart = new SankeyChart("sankChart", globalDataArray[7]);
      $("#main_title").text("Types of vehicles involved in accidents");
    }
    if (carouselIndex == 4) {
      $("#main_title").text("Affect of weather on car accidents");
    }

    if (carouselIndex == 5 && !myPieChart) {
      myPieChart = new PieChart("pieDivRight", globalDataArray[5]);
      $("#main_title").text("Affect of weather on car accidents");
    }
    if (carouselIndex == 6) {
      $("#main_title").text("Car crashes in each month 2016-2019");
    }

    if (carouselIndex == 7 && !mylineViz) {
      mylineViz = new lineViz("line-chart", globalDataArray[3]);
      $("#main_title").text("Car crashes in each month 2016-2019");
    }
    if (carouselIndex == 8) {
      $("#main_title").text("Hourly Distribution of Car Crashes");
    }
    if (carouselIndex == 9 && !sPlot) {
      sPlot = new ScatterPlot("chart-area", globalDataArray[5]);

      $("#main_title").text("Hourly Distribution of Car Crashes");

      $("#play-button").on("click", function () {
        var button = $(this);

        console.log("Initail Button text" + String(button.text()).trim(" "));
        button[0].innerHTML = String(button.text()).trim(" ");
        if (button.text() == "Play") {
          button.text("Pause");
          //   interval = setInterval(sPlot.step, 2000);
          sPlot.interval = setInterval(() => {
            sPlot.step(sPlot);
          }, 2000);
        } else {
          button.text("Play");
          clearInterval(sPlot.interval);
        }
      });

      console.log($("#play-button"));
      console.log($("#date-slider"));
      function resetButtonChange() {}
      $("#reset-button").on("click", () => {
        console.log("RESETTING");
        sPlot.resetButtonChange();
      });
    }

    if (carouselIndex == 9 && !bplot) {
      bplot = new InnovativeBar("InBar", globalDataArray[8]);
    }

    if (carouselIndex == 11 && !bplot1) {
      //bubbleChart = new BubbleChart("bubbleDiv");
      bplot1 = new barModified("bubbleDiv", globalDataArray[6]);
    }
    if (carouselIndex == 11 && !bubbleBar) {
      bubbleBar = new BarChart("bubbleBarDiv", globalDataArray[4]);
    }

    // if (carouselIndex == 1 && !myBrushVis) {
    //   myBrushVis = new BrushVis("brushDiv", globalDataArray[1]);
    // }

    //document.getElementById("switchView").innerHTML === "map view"
    // ? (document.getElementById("switchView").innerHTML = "table view")
    // : (document.getElementById("switchView").innerHTML = "map view");
  }
}

function switchPrev() {
  if (carouselIndex > 0) {
    carousel.prev();
    carouselIndex--;
    if (carouselIndex == 0) {
      $("#main_title").text("Car Accidents In The U.S. 2016-2019");
    }
    if (carouselIndex == 1) {
      $("#main_title").text(
        "Car Crash Fatalities Across All States In The U.S."
      );
    }
    if (carouselIndex == 2) {
      $("#main_title").text("Types of vehicles involved in accidents");
    }
    if (carouselIndex == 3) {
      $("#main_title").text("Types of vehicles involved in accidents");
    }
    if (carouselIndex == 4) {
      $("#main_title").text("Effect of weather on car accidents");
    }
    if (carouselIndex == 5) {
      $("#main_title").text("Effect of weather on car accidents");
    }
    if (carouselIndex == 6) {
      $("#main_title").text("Car crashes in each month 2016-2019");
    }
    if (carouselIndex == 7) {
      $("#main_title").text("Car crashes in each month 2016-2019");
    }
    if (carouselIndex == 8) {
      $("#main_title").text("Hourly Distribution of Car Crashes");
    }
    if (carouselIndex == 9) {
      $("#main_title").text("Hourly Distribution of Car Crashes");
    }
    if (carouselIndex == 10) {
      $("#main_title").text("Effect of Alcohol on Car Accidents");
    }
    if (carouselIndex == 11) {
      $("#main_title").text("Effect of Alcohol on Car Accidents");
    }
    if (carouselIndex == 12) {
      $("#main_title").text("Key Findings");
    }
    if (carouselIndex == 13) {
      $("#main_title").text("Main Message");
    }
    if (carouselIndex == 14) {
      $("#main_title").text("The End");
    }
  }

  //document.getElementById("switchView").innerHTML === "map view"
  // ? (document.getElementById("switchView").innerHTML = "table view")
  // : (document.getElementById("switchView").innerHTML = "map view");
}
