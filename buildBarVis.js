// Creates a bar visualization
// @data: the data from the csv
// @translateXCoordinate: How far over (x-wise) the graph should go
// @vizNumber: The number of the viz, either 1 2 or 3
// @vizLabel: The label for the viz (what attribute it is)
function buildBarVis(data, translateXCoordinate, vizNumber, vizLabel) {
  // We can now hide the loading image
  showLoadingImage(false);

  var w = 300;
  var h = 700;

  var format = d3.format(",.0f");

  var x = d3.scale.linear().range([10, w-50]),
      y = d3.scale.ordinal().rangeBands([0, h-50], .1);

  var xAxis = d3.svg.axis().scale(x).orient("top").ticks(4).tickSize(-h + 60),
      yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  var svg = d3.select("#locationOfSVGs").append("svg")
      .attr("class", getVizName(vizNumber))
      .style("background-color", "#3a498c")
      .style("padding-left", "10px")
      .style("margin-right", "10px")
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
      .attr("fill", "white")
      .style("font-weight", "bold")
      .call(xAxis);

  // Adding y axis to screen
  svg.append("g")
      .attr("class", "labels, axis")
      .attr("fill", "white")
      .style("font-weight", "bold")
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
      .attr("fill", "#399DB1")
      .attr("transform", "translate(" + 10 + ",0)")
      .attr("width", function(d, i) {
        return x(d.values.length); 
      })
      .attr("height", y.rangeBand())
      .on("click", function(d, i) {
        if(vizNumber == 1){
          buildWordCloudVis(d.values, "Round");
        } else {
          buildWordCloudVis(d.values, "Value");
        }
      })
      .on("mouseover", function(d, i) {
        if(vizNumber == 1){
          showLoadingImage(true);
          setTimeout(function(){
          // Remove the old second and third charts
            d3.select("svg.secondChart")
            .remove();
            d3.select("svg.thirdChart")
              .remove();
              buildBarVis(aggregateByValue(data[i].values), 25, vizNumber + 1, "Value");
          }, 10);
        } else if (vizNumber == 2) {
          // Show loading image
          showLoadingImage(true);
          setTimeout(function(){
            d3.select(".calendarLabel")
              .remove();
            d3.select(".calendarBoxSVG")
              .remove();
            buildCalendarViewVis(aggregateByYear(data[i].values), 25, vizNumber + 1, "Air Date");
          }, 10);
        }
        d3.select(this)
          .attr("fill", "#8dcad6");
       })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill", "#399DB1");
    });

  // Placing the label text for each bar
  bar.append("text")
      .attr("fill", "white")
      .attr("class", "labels")
      .style("font-size", "14px")
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
      .style("font-size","15px")
      .style("font-weight","bold")
      .attr("fill", "white")
      .text(vizLabel);

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

  var w = 1200;
  var h = 500;

  var format = d3.format(",.0f");

  var x = d3.scale.linear().range([10, w-50]),
      y = d3.scale.ordinal().rangeBands([0, h-50], .1);

  var xAxis = d3.svg.axis().scale(x).orient("top").ticks(4).tickSize(-h + 60),
      yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  var svg = d3.select("#locationOfSVGs").append("svg")
      .style("background-color", "#3a498c")
      .style("padding", "30px")
      .style("margin", "30px")
      .attr("class", "countWordsVis")
      .attr("padding-left", "20")
      .attr("margin-left", "20")
      .attr("width", w+125)
      .attr("height", h)
    .append("g")
      .attr("transform", "translate(" + (translateXCoordinate + 25) + "," + 30 + ")");

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
      .attr("x", w / 2 - 50 )
      .attr("y", h - 40)
      .style("font-size","20px")
      .style("font-weight","bold")
      .attr("fill", "white")
      .text(vizLabel);

}