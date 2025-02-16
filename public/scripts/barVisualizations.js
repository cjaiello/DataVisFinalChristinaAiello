// By Christina Aiello

// Creates a bar visualization
// @data: the data from the csv
// @translateXCoordinate: How far over (x-wise) the graph should go
// @vizNumber: The number of the viz, either 1 2 or 3
// @vizLabel: The label for the viz (what attribute it is)
function buildBarVis(data, translateXCoordinate, vizNumber, vizLabel) {
  // We can now hide the loading image
  showLoadingImage(false);

  var w = 225;
  var h = 650;

  var format = d3.format(",.0f");

  var x = d3.scale.linear().range([10, w-50]),
      y = d3.scale.ordinal().rangeBands([0, h-50], .1);

  var xAxis = d3.svg.axis().scale(x).orient("top").ticks(4).tickSize(-h + 60).tickFormat(d3.format("s")),
      yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  var svg = d3.select("#locationOfSVGs").append("svg")
      .attr("class", getVizName(vizNumber))
      .style("background-color", "#3b6c88")
      .attr("width", w+115)
      .attr("height", h)
    .append("g")
      .attr("transform", "translate(" + (translateXCoordinate + 25) + "," + 30 + ")");

  // Set the scale domain.
  x.domain([0, d3.max(data, function(d) {
    return d.values.length;
  })]);
  y.domain(data.map(function(d) { return d.key; }));

  // Adding x axis to screen
  svg.append("g")
      .attr("class", "x axis, axis")
      .attr("fill", "#ffffff")
      .style("font-weight", "bold")
      .call(xAxis);

  // Adding y axis to screen
  svg.append("g")
      .attr("class", "labels, axis")
      .attr("fill", "#ffffff")
      .style("font-weight", "bold")
      .style("font-size", "10px")
      .attr("transform", "translate(" + 10 + ",0)")
      .call(yAxis);


  var bar = svg.selectAll("g.bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {
        return "translate(1," + y(d.key) + ")";
      });

  // Putting the rectangles on the bar chart
  bar.append("rect")
      .attr("fill", "#50cace")
      .attr("transform", "translate(" + 10 + ",0)")
      .attr("width", function(d, i) {
        return x(d.values.length);
      })
      .attr("height", y.rangeBand())
      .on("mouseover", function(d, i) {
        if(vizNumber == 1){
          showLoadingImage(true);
          setTimeout(function(){
          // Remove the old second and third charts
            d3.selectAll("svg.secondChart")
            .remove();
            d3.selectAll(".calendarBoxSVG")
              .remove();
            d3.selectAll(".calendarLabel")
              .remove();
              buildBarVis(aggregateByValue(data[i].values), 85, vizNumber + 1, "Value");
          }, 10);
        } else if (vizNumber == 2) {
          // Show loading image
          showLoadingImage(true);
          setTimeout(function(){
            d3.selectAll(".calendarLabel")
              .remove();
            d3.selectAll(".calendarBoxSVG")
              .remove();
            buildCalendarViewVis(aggregateByYear(data[i].values), 25, vizNumber + 1, "Air Date");
          }, 10);
        }
        d3.select(this)
          .attr("fill", "#34b5b9");
       })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill", "#50cace");
    });

  // Placing the label text for each bar
  bar.append("text")
      .attr("fill", "#ffffff")
      .attr("class", "labels")
      .style("font-size", "12px")
      .attr("x", function(d) {
        return x(d.values.length);
      })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", 40)
      .attr("dy", ".35em")
      .style("font-weight","bold")
      .attr("text-anchor", "end")
      .text(function(d) {
        return format(d.values.length);
      });

  svg.append("text")
      .attr("x", w / 2 - 50 )
      .attr("y", h - 40)
      .style("font-size","14px")
      .style("font-weight","bold")
      .attr("fill", "#ffffff")
      .text(vizLabel);

}

// Creates a bar visualization
// @dataObject: the data from the csv
// @translateXCoordinate: How far over (x-wise) the graph should go
function buildWordMatchComparisonBarVis(dataObject, translateXCoordinate, word, vizNumber, topBoundForGraphs) {

  // Now we can hide the loading image
  showLoadingImage(false);

  //var combinedMapAndCounts = combineHashmapsAndTotalUpCountsInHashmap(dataObject.Questions, dataObject.Answers, dataObject.Categories);
  //var hashMapOfDatesAndCounts = combinedMapAndCounts[0];

  // Make an object for each attribute:
  var questionData = new Object();
  questionData.Attribute = "Question";
  questionData.Value = dataObject["QuestionCounter"];
  var answerData = new Object();
  answerData.Attribute = "Answer";
  answerData.Value = dataObject["AnswerCounter"];
  var categoryData = new Object();
  categoryData.Attribute = "Category";
  categoryData.Value = dataObject["CategoryCounter"];
  var dateMapOfMatches = dataObject["MatchesMap"];
  console.log(dateMapOfMatches);



  // Creating a list of this data:
  var data = [];
  data.push(questionData);
  data.push(answerData);
  data.push(categoryData);

  var w = 250;
  var h = 250;

  var format = d3.format(",.0f");

  var x = d3.scale.ordinal().rangeRoundBands([0, w], .1);

  var y = d3.scale.linear().range([h, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    //.tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  var svg = d3.select("#locationOfSVGsWordComparison").append("svg")
      .style("background-color", "#c3e1bd")
      .style("margin", "10px")
      .attr("class", "countWordsVis")
      .attr("padding-left", "20")
      .attr("margin-left", "20")
      .attr("width", w + 100)
      .attr("height", h + 100)
    .append("g")
      .attr("transform", "translate(" + (translateXCoordinate + 25) + "," + 30 + ")");

  // Set the domains
  x.domain(data.map(function(d) { return d.Attribute; }));
  // Use either the max of the two graphs if you're viewing two words,
  // or just use the max of one word if only viewing one
  y.domain([0, (topBoundForGraphs != null) ? (topBoundForGraphs + (topBoundForGraphs * .1)) : d3.max(data, function(d) {
    return d.Value
  })]);

  // Adding x axis to screen
  svg.append("g")
      .attr("class", "x axis")
      .attr("fill", "#0B486B")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  // Adding y axis to screen
  svg.append("g")
      .attr("class", "wordSearchLabel")
      .attr("fill", "#0B486B")
      .call(yAxis);

  var tip = d3.tip()
    .attr('class', 'd3-tip-barvis')
    .offset([-5, 0])
    .html(function(d) {
        return d.Value;
      });

  svg.call(tip);

  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("fill", "#79BD9A")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.Attribute); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        return y(parseInt(d.Value)); })
      .attr("height", function(d) {
        return h - parseInt(y(d.Value)) })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  svg.append("text")
      .attr("x", w * (1/22))
      .attr("y", h + 45)
      .style("font-size","18px")
      .style("font-weight","bold")
      .attr("fill", "#0B486B")
      .attr("class", "barChartLabel")
      .text("Appearances of \"" + word + "\"");

  buildCalendarViewVisForWordComparisons(dateMapOfMatches, 25, vizNumber, "Air Dates of Shows When Word \"" + word + "\" Occurred", word);

}

// Creates a bar visualization
// @data: the data from the csv
// @translateXCoordinate: How far over (x-wise) the graph should go
// @vizNumber: The number of the viz, either 1 2 or 3
// @vizLabel: The label for the viz (what attribute it is)
function buildWordMatchBarVis(dataObject, translateXCoordinate, vizNumber, vizLabel) {
  // Now we can hide the loading image
  showLoadingImage(false);

  // Make an object for each attribute:
  var questionData = new Object();
  questionData.Attribute = "Question";
  questionData.Value = dataObject.Questions;
  var answerData = new Object();
  answerData.Attribute = "Answer";
  answerData.Value = dataObject.Answers;
  var categoryData = new Object();
  categoryData.Attribute = "Category";
  categoryData.Value = dataObject.Categories;

  // Creating a list of this data:
  var data = [];
  data.push(questionData);
  data.push(answerData);
  data.push(categoryData);

  var w = 500;
  var h = 500;

  var format = d3.format(",.0f");

  var x = d3.scale.linear().range([10, w-50]),
      y = d3.scale.ordinal().rangeBands([0, h-50], .1);

  var xAxis = d3.svg.axis().scale(x).orient("left").ticks(4).tickSize(-h + 60),
      yAxis = d3.svg.axis().scale(y).orient("top").tickSize(0);

  var svg = d3.select("#locationOfSVGs").append("svg")
      .style("background-color", "#3a498c")
      .style("padding", "16px")
      .style("margin", "16px")
      .attr("class", "countWordsVis")
      .attr("padding-left", "20px")
      .attr("margin-left", "20px")
      .attr("width", w + 125)
      .attr("height", h + 50)
    .append("g")
      .attr("transform", "translate(" + translateXCoordinate + "," + 25 + ")");

  // Set the scale domain.
  x.domain([0, d3.max(data, function(d) {
    return d.Value;
  })]);
  y.domain(data.map(function(d) { return d.Attribute; }));

  // Adding x axis to screen
  svg.append("g")
      .attr("class", "x axis")
      .attr("fill", "white")
      .call(xAxis);

  // Adding y axis to screen
  svg.append("g")
      .attr("class", "wordSearchLabel")
      .attr("fill", "white")
      .attr("transform", "translate(" + 10 + ",0)")
      .call(yAxis);

  var bar = svg.selectAll("g.bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {
        return "translate(1," + y(d.Attribute) + ")";
      });

  // Putting the rectangles on the bar chart
  bar.append("rect")
      .attr("fill", "#399DB1")
      .attr("transform", "translate(" + 10 + ",0)")
      .attr("width", function(d) {
        return x(parseInt(d.Value));
      })
      .attr("height", y.rangeBand());

  // Placing the label text for each bar
  bar.append("text")
      .attr("class", "wordSearchLabel")
      .attr("x", function(d) {
        return x(parseInt(d.Value));
      })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", 20)
      .attr("dy", ".35em")
      .style("font-weight","bold")
      .attr("text-anchor", "end")
      .attr("fill", "white")
      .text(function(d) {
        return d.Value;
      });

  svg.append("text")
      .attr("x", w * (1/5) )
      .attr("y", h - 40)
      .style("font-size","20px")
      .style("font-weight","bold")
      .attr("fill", "white")
      .text(vizLabel);

}
