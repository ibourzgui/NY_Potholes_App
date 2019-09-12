
function buildBarChart() {


var URL = "/api/v1.0/chart"
d3.json(URL, function (data) {
   
console.log(data);


var trace1 = {
   	x: data.openx,
   	y: data.openy,
   	type: "bar",
   	name: "Open"
    
   }
   var trace2 = {
    x: data.closedx,
    y: data.closedy,
    type: "bar",
    name: "Closed"
   
  }
  var trace3 = {
    x: data.pendingx,
    y: data.pendingy,
    type: "bar",
    name: "Pending"
   
  }

  var pdata = [trace1,trace2,trace3];
  var layout = {
    title: "Pothole Status Counts per Borough",
    x: "NYC Boroughs",
    y: "status counts",
    barmode: "stack"

  
  
  };



  Plotly.newPlot("bar", pdata, layout);

  


})}

buildBarChart();