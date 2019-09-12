let queryUrl = "/api/v1.0/getgifs";

console.log("this has loaded");

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  
  gifPic = data.results[0].media[0].gif.url
  // console.log(gifPic)
  
  for (var i = 0; i < data.results.length; i++){
  	console.log(data.results[i].media[0].gif.url)
  
  var newDiv = d3.select('body').select("#showGifs").append('div').append('img').attr("src",data.results[i].media[0].gif.url).attr("class", "potHoleGifs")
}

});
