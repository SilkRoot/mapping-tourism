//definition of variables
var projection = d3.geo.mercator();
var germany = void 0;
var map = void 0; //Update global
var height = 600;
var width = 600;
var viewportwidth;
var viewportheight;
var months = ["average", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];//array
var text = "";
var cityPoints = void 0;
var scaling_x = 1;
var scaling_y = 1;
var curr_month = 1;
  
function set_mapsize (){
  console.log("the function set_mapsize is called");
  //controlprint to console
  for (index = 0; index < months.length; index++) {
    text = "looprun #" + index + ": " + months[index];
    console.log(text);
  } 

  //get windowsize
  viewportwidth = window.innerWidth,
  viewportheight = window.innerHeight

  //adapt map size
  if (viewportheight<600){
    height = 600;
    width = 400;
  }
  else {
    height = viewportheight*0.9;
  }
  if (viewportwidth<400){
    width = 400;
    height = 600;
  }
  else {
    width = viewportwidth*0.49;
  }

  return(height, width);
}//set_mapsize

set_mapsize();
console.log("heigt is set to: " + height);
console.log("width is set to: " + width);

function scalingfactor_x (val){
  console.log("the function scalingfactor is called");
  scaling_x = val*0.1;
  console.log("the chosen scalingfactor for x is: " + scaling_x);
  scaling_x = scaling_x * Math.abs(scaling_x);
  console.log("the quadric scalingfactor for x is: " + scaling_x);
  scaling_x = scaling_x * 0.1;
  console.log("the final scalingfactor for x is: " + scaling_x);
  change(curr_month);
  return(scaling_x);
}

function scalingfactor_y (val){
  console.log("the function scalingfactor is called");
  scaling_y = val*0.1;
  console.log("the chosen scalingfactor for y is: " + scaling_y);
  scaling_y = scaling_y * Math.abs(scaling_y);
  console.log("the quadric scalingfactor for y is: " + scaling_y);
  scaling_y = scaling_y * 0.1;
  console.log("the final scalingfactor for y is: " + scaling_y);
  change(curr_month);
  return(scaling_y);
}

//function to create once the map and the diagrams (zooming also included)
var mapping = function(svg){
  console.log("the function mapping is called");

  var path = d3.geo.path().projection(projection);
  
  //Aufrug der Topojson funktion
  d3.json('./topojson/germany-topo_simp.json', function(data) {
    var states = topojson.feature(data, data.objects.DEU_adm2);

    //definition of the scale depending od view port and used for scaling of the correct diagram position
    var b, s, t;
    projection.scale(1).translate([0, 0]);
    var b = path.bounds(states);
    var s = .9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    projection.scale(s).translate(t);

    //apply paths
    map = svg.append('g').attr('class', 'boundary');
    germany = map.selectAll('path').data(states.features);

    germany.enter()
      .append('path')
      .attr('d', path);

    //define color (if not choropleth)
    //germany.attr('fill', '#eee');

    //choropleth
    var color = d3.scale.linear().domain([0,33]).range(['red', 'yellow']);
    germany
      .style('fill', function(d,i) {return color(i)})
      .style('fill-opacity', 0.2)

    germany.exit().remove();
   
   //read CSV
    d3.csv('./data/cities.csv', function(cities) {
      cityPoints = svg.selectAll('rect').data(cities);
      cityText = svg.selectAll('text').data(cities);
   
      //creation of charts
      //ENTER
      cityPoints.enter()
        .append('rect')
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_1*0.5*0.3})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_1*0.5*0.01})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_1*0.3;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_1*0.01;} )//get height times a scaling factor
        .attr('fill', 'steelblue');//define colour and (no) stroke
      cityPoints.style('fill-opacity', 0.7);//set opacity
      //cityPoints.exit();
    });//d3.csv(...)

    //zoom function
    var zoomed = function () {
      console.log("the function zoomed is called");
      map.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
      cityPoints.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
    };//zoomed function

    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);
  });
  return(map);
};
//create charts
   
//Update function to change the diagrams
function change(month){
  console.log("the function change is called");
  month_name = months[month];
  console.log("index of the given month: " + month + " which results in the month: " + month_name);
  var column_1 = "arrivals_" + month_name;
  var column_2 = "stay_" + month_name;
  //get data again
  d3.csv('./data/cities.csv', function(cities) {
    cityPoints = svg.selectAll('rect').data(cities);

    //UPDATE
    if (month == 0){
      cityPoints.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_0*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_0*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_0*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_0*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts has been fired");
        curr_month = 0;
    }//if
    if (month == 1){
      cityPoints.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_1*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_1*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_1*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_1*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts has been fired");
        curr_month = 1;
    }//if
    if (month == 2){
      cityPoints.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_2*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_2*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_2*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_2*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts has been fired");
        curr_month = 2;
    }//if
    if (month == 3){
      cityPoints.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_3*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_3*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_2*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_2*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts has been fired");
        curr_month = 3;
    }//if
  });//d3.csv

  //zoom function
  var zoomed = function () {
    console.log("the function zoomed is called");
    map.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
    cityPoints.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
  };//zoomed function

  var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);
};//function change


//selection of DOM-element
var svg = d3.select("#map1")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

mapping(svg);