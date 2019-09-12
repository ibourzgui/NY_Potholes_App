// Adding a tile layer (the background map image) to map
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
 attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
 maxZoom: 18,
 id: "mapbox.light",
 accessToken: API_KEY
});

// Initialize the LayerGroups we'll be using - Open, Closed, All other status will be under pending
var layers = {
  OPEN_POTHOLE: new L.LayerGroup(),
  CLOSED_POTHOLE: new L.LayerGroup(),
  STATUS_PENDING: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [40.7433, -73.9196],
  zoom: 11,
  layers: [
    layers.OPEN_POTHOLE,
    layers.CLOSED_POTHOLE,
    layers.STATUS_PENDING
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Open Pothole": layers.OPEN_POTHOLE,
  "Closed Pothole": layers.CLOSED_POTHOLE,
  "Status TBD": layers.STATUS_PENDING
};

// Create a control for the layers and add the overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initalize icons to add to each layer group
var icons = {
  OPEN_POTHOLE: L.ExtraMarkers.icon({
    icon: "ion-android-warning",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  CLOSED_POTHOLE: L.ExtraMarkers.icon({
    icon: "ion-ios-close",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  }),
  STATUS_PENDING: L.ExtraMarkers.icon({
    icon: "ion-wrench",
    iconColor: "white",
    markerColor: "orange",
    shape: "star"
  })
};

// Perform a call to the data end point so that we can get the info
d3.json("http://127.0.0.1:5000/api/v1.0/querydata", function(potholedata) {
  //create a variable called potholeCode
  var potholeCole;

  // create a variable to keep count of open and close potholes
  var potholeCount = {
    OPEN_POTHOLE: 0,
    CLOSED_POTHOLE: 0,
    STATUS_PENDING: 0
  }
  // Loop through the pothole data and put into the open or closed layer
  for (var i = 0; i < potholedata.length; i++) {
    var potholestatus = potholedata[i].status
    // If a pothole status is open, put in the "OPEN_POTHOLE" layer
    if (potholestatus === "Open") {
      potholeCode = "OPEN_POTHOLE";
    }
    // If the pothole status is closed, put in the "CLOSED_POTHOLE" layer
    else if (potholestatus === "Closed") {
      potholeCode = "CLOSED_POTHOLE";
    }
    else {
      potholeCode = "STATUS_PENDING"
    }
  
    // Update the pothole count 
    potholeCount[potholeCode]++;

    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.marker([potholedata[i].latitude, potholedata[i].longitude], {
      icon: icons[potholeCode]
    });

    // Add the new marker to the appropriate layer
    newMarker.addTo(layers[potholeCode]);

    // Bind a popup to the marker that will  display on click. This will be rendered as HTML
    newMarker.bindPopup(
        "City: " + potholedata[i].city 
        + "<br> Status: " + potholedata[i].status
        + "<br> Date Opened: " + potholedata[i].created_date 
        + "<br> Date Closed: " + potholedata[i].closed_date);
  }

    // Call the updateLegend function to update the legend
    updateLegend(potholeCount);
});

// Update the legend's innerHTML with the last updated time and pothole count
function updateLegend(potholeCount) {
  document.querySelector(".legend").innerHTML = [
    //"<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='open'>Open Potholes: " + potholeCount.OPEN_POTHOLE + "</p>",
    "<p class='closed'>Closed Potholes: " + potholeCount.CLOSED_POTHOLE + "</p>",
    "<p class='pending'>Status TBD Potholes: " + potholeCount.STATUS_PENDING + "</p>"
  ].join("");
}