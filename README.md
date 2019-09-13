# NY_Potholes_App

# Summary: 

This is a web application that fetches the most recent potholes reports and their status in the 5 borroughs of NYC. The data is obtained from https://opendata.cityofnewyork.us/ as a JSON format using the site API and Socrata dependency that allowed for saving time by removing the need of using an API key.

The live data is stored in a Mongo Database and is then rendered through a Flask API to specifically defined routes. 
The data is filtered, wrangled, and visualized under multiple pages where the first 2000 enteries are displayed as a datatable with filters and pagination. Also the visualization page allows to toggle the pothole "status" view (open, closed, pending) with JS leaflet map.  

# Process: 


