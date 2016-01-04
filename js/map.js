//definition of variables
var projection = d3.geo.mercator();
var germany = void 0;
var map1 = void 0; //Update global
var map2 = void 0; //Update global
var height = 600;
var width = 600;
var viewportwidth;
var viewportheight;
var text = "";
var cityPoints1 = void 0;
var cityPoints2 = void 0;
var scaling_x = 0.1;
var scaling_y = 0.1;
var curr_month = 1;
var svg1 = void 0;
var svg2 = void 0;
  
function set_mapsize (){
  console.log("the function set_mapsize is called");
  
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
    width = viewportwidth*0.48;
  }

  return(height, width);
}//set_mapsize

set_mapsize();
console.log("heigt is set to: " + height);
console.log("width is set to: " + width);

function scalingfactor_x (val){
  console.log("the function scalingfactor is called");
  val=val*0.1*0.5;
  console.log("The factor, the scalingfactor is multiplied with is: " + val);
  scaling_x = val*0.2;
  console.log("the final scalingfactor for x is: " + scaling_x);
  change(curr_month);
  return(scaling_x);
}

function scalingfactor_y (val){
  console.log("the function scalingfactor is called");
  val=val*0.1*0.5;
  console.log("The factor, the scalingfactor is multiplied with is: " + val);
  scaling_y = val*0.05;
  console.log("the final scalingfactor for y is: " + scaling_y);
  change(curr_month);
  return(scaling_y);
}

//function to create once the map and the diagrams (zooming also included)
var mapping1 = function(svg1){
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
    map1 = svg1.append('g').attr('class', 'boundary');
    germany = map1.selectAll('path').data(states.features);

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
    d3.csv('./data/cities1.csv', function(cities) {
      cityPoints1 = svg1.selectAll('rect').data(cities);
      cityText1 = svg1.selectAll('text').data(cities);
   
      //creation of charts
      //ENTER
      cityPoints1.enter()
        .append('rect')
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_1*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_1*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_1*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_1*scaling_y;} )//get height times a scaling factor
        .attr('fill', 'steelblue');//define colour and (no) stroke
      cityPoints1.style('fill-opacity', 0.7);//set opacity
      //cityPoints.exit();
    });//d3.csv(...)

    //zoom function
    var zoomed1 = function () {
      console.log("the function zoomed is called");
      map1.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
      cityPoints1.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
    };//zoomed function

    var zoom1 = d3.behavior.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed1);

    svg1.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .call(zoom1);
  });
  return(map1, cityPoints1, svg1);
};
//create charts

//function to create once the map and the diagrams (zooming also included)
var mapping2 = function(svg2){
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
    map2 = svg2.append('g').attr('class', 'boundary');
    germany = map2.selectAll('path').data(states.features);

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
    d3.csv('./data/cities2.csv', function(cities) {
      cityPoints2 = svg2.selectAll('rect').data(cities);
      cityText1 = svg2.selectAll('text').data(cities);
   
      //creation of charts
      //ENTER
      cityPoints2.enter()
        .append('rect')
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_1*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_1*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_1*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_1*scaling_y;} )//get height times a scaling factor
        .attr('fill', 'steelblue');//define colour and (no) stroke
      cityPoints2.style('fill-opacity', 0.7);//set opacity
      //cityPoints.exit();
    });//d3.csv(...)

    //zoom function
    var zoomed2 = function () {
      console.log("the function zoomed is called");
      map2.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
      cityPoints2.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
    };//zoomed function

    var zoom2 = d3.behavior.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed2);

    svg2.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .call(zoom2);
  });
  return(map2, cityPoints2, svg2);
};
//create charts
   
//Update function to change the diagrams
function change(month){
  console.log("###############################################################");
  console.log("the function change1 with the parameter " + month + " is called");
  change1(month);
  change2(month);
}


function change1(month){
  console.log("the function change1 with the parameter " + month + " is called");
  console.log("the current scaling factor for x is: " + scaling_x);
  console.log("the current scaling factor for y is: " + scaling_y);

  //get data again
  d3.csv('./data/cities1.csv', function(cities) {
    cityPoints1 = svg1.selectAll('rect').data(cities);

    //UPDATE
    if (month == 0){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_0*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_0*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_0*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_0*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 0;
    }//if
    if (month == 1){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_1*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_1*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_1*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_1*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 1;
    }//if
    if (month == 2){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_2*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_2*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_2*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_2*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 2;
    }//if
    if (month == 3){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_3*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_3*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_3*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_3*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 3;
    }//if
    if (month == 4){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_4*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_4*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_4*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_4*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 4;
    }//if
    if (month == 5){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_5*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_5*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_5*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_5*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 5;
    }//if
    if (month == 6){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_6*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_6*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_6*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_6*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 6;
    }//if
    if (month == 7){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_7*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_7*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_7*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_7*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 7;
    }//if
    if (month == 8){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_8*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_8*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_8*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_8*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 8;
    }//if
    if (month == 9){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_9*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_9*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_9*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_9*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 9;
    }//if
    if (month == 10){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_10*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_10*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_10*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_10*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 10;
    }//if
    if (month == 11){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_11*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_11*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_11*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_11*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 11;
    }//if
    if (month == 12){
      cityPoints1.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_12*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_12*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_12*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_12*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts1 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 12;
    }//if
  });//d3.csv

  //zoom function
  var zoomed1 = function () {
    console.log("the function zoomed is called");
    map1.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
    cityPoints1.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
  };//zoomed function

  var zoom1 = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed1);

  svg1.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .call(zoom1);

  console.log ("function change1 finished");
  console.log (" ");
  console.log (" ");
  console.log (" ");
};//function change

//Update function to change the diagrams
function change2(month){
  console.log("the function change2 with the parameter " + month + " is called");
  console.log("the current scaling factor for x is: " + scaling_x);
  console.log("the current scaling factor for y is: " + scaling_y);
  //get data again
  d3.csv('./data/cities2.csv', function(cities) {
    cityPoints2 = svg2.selectAll('rect').data(cities);

    //UPDATE
    if (month == 0){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_0*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_0*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_0*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_0*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 0;
    }//if
    if (month == 1){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_1*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_1*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_1*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_1*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 1;
    }//if
    if (month == 2){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_2*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_2*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_2*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_2*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 2;
    }//if
    if (month == 3){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_3*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_3*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_3*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_3*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 3;
    }//if
    if (month == 4){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_4*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_4*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_4*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_4*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 4;
    }//if
    if (month == 5){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_5*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_5*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_5*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_5*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 5;
    }//if
    if (month == 6){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_6*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_6*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_6*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_6*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 6;
    }//if
    if (month == 7){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_7*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_7*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_7*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_7*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 7;
    }//if
    if (month == 8){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_8*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_8*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_8*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_8*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 8;
    }//if
    if (month == 9){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_9*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_9*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_9*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_9*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 9;
    }//if
    if (month == 10){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_10*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_10*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_10*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_10*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 10;
    }//if
    if (month == 11){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_11*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_11*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_11*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_11*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 11;
    }//if
    if (month == 12){
      cityPoints2.transition().duration(500)
        .attr('x', function(d) {return (projection([d.lon, d.lat])[0])-d.arrivals_12*0.5*scaling_x})//get latitude minus half of the diagram size (times diagramm scaling factor) to get a correct offset
        .attr('y', function(d) {return (projection([d.lon, d.lat])[1])-d.stay_12*0.5*scaling_y})//get longitude minus half of the diagramm size (times diagramm scaling factor) to get a correct offset
        .attr('width', function(d) {return d.arrivals_12*scaling_x;} )//get width times a scaling factor
        .attr('height', function(d) {return d.stay_12*scaling_y;} );//get height times a scaling factor
        console.log("Update of charts2 has been fired");
        console.log("The choosen month is :" + month);
        curr_month = 12;
    }//if
  });//d3.csv

  //zoom function
  var zoomed2 = function () {
    console.log("the function zoomed is called");
    map2.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
    cityPoints2.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
  };//zoomed function

  var zoom2 = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed2);

  svg2.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .call(zoom2);

  console.log ("function change 2 finished");
  console.log (" ");
};//function change2

//selection of DOM-element
var svg1 = d3.select("#map1")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

mapping1(svg1);

var svg2 = d3.select("#map2")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

mapping2(svg2);