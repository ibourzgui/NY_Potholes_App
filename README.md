# NY_Potholes_App

# Summary: 

This is a web application that fetches the most recent potholes reports and their status in the 5 borroughs of NYC. The data is obtained from https://opendata.cityofnewyork.us/ as a JSON format using the site API and Socrata dependency that allowed for saving time by removing the need of using an API key.

The live data is stored in a Mongo Database and is then rendered through a Flask API to specifically defined routes. 
The data is filtered, wrangled, and visualized under multiple pages where the first 2000 enteries are displayed as a datatable with filters and pagination. Also the visualization page allows to toggle the pothole "status" view (open, closed, pending) with JS leaflet map.  

# Procedure:

- An app.py python script was written to establish a connection to mongodb using a local host
mongo = PyMongo(app, uri="mongodb://localhost:27017/ny_potholes")

- Via @app.route("/api/v1.0/insertdata"), a connection to the city of NY API is established using Socrata method and the first 2000 observations are extracted and stored into mongodb. Entries missing location input were dropped from the database

- Via @app.route("/data"), the first 200 observations in the database are rendered as a displayed table on data.html page using DataTable JS library. This table is searchable by any field, sortable by column and has pagination.

- Via @app.route("/visualization"), the data is visualized using multiple javascript libraries. A js leaflet map and a js plotly stacked bar graph. 
The data is visualized as a map for the 5 NYC boroughs where the status of potholes are toggled as three different views on the map. 


- js scripts are found under the js folder for each of the stacked bard graph, leaflet map and its API key. 

- Via @app.route("/api/v1.0/getdata"), The NY pothole data can be refreched and updated on the app via a refresh button on data.html page 












