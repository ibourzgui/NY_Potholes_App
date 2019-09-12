from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

from sodapy import Socrata
import time
import json
import requests
from bson import json_util
import pandas as pd

app = Flask(__name__)
CORS(app)


# establish a connection to mongodb and create table ny_potholes
mongo = PyMongo(app, uri="mongodb://localhost:27017/ny_potholes")

# route to the main html page
@app.route("/")
def home():
	return render_template("index.html")

# routes for other html pages
@app.route("/aboutus")
def about():
	return render_template("aboutus.html")

@app.route("/visualization")
def visualize():
	return render_template("visualization.html")

@app.route("/api")
def api():
	return render_template("api.html")

# route to render data from db into table
@app.route("/data")
def data():
	
	db_data  = list(mongo.db.data.find())
	
	# json.dumps(docs_list, default=json_util.default)
	return render_template("data.html", potholeData= db_data[:200])


@app.route("/api/v1.0/getdata")
def getData():

	client = Socrata("data.cityofnewyork.us", None)
	results = client.get("fed5-ydvq", limit=2000)
	#insert data into mongodb 
	new_result = results

	# rediret to data.html and update table
	return jsonify(new_result)

@app.route("/api/v1.0/querydata")
def queryData():

	db_data = list(mongo.db.data.find())
	return json.dumps(db_data, default =json_util.default)

# connect to the city of NY API and extract the first 2000 observations and insert into db
@app.route("/api/v1.0/insertdata")
def insertData():
	#drop mongo data from db if exists 
	mongo.db.data.drop()
	#call the socrata client to get first 2000 potholes 
	client = Socrata("data.cityofnewyork.us", None)
	results = client.get("fed5-ydvq", limit=2000)
	#insert data to mongodb 
	new_result = results
	time.sleep(25)
	mongo.db.data.insert_many(new_result)
	mongo.db.data.delete_many({"location": {"$exists": False}})

	return (
		f"<strong><p style='color:green;font-size:30px'></strong>Success!</p><strong>{mongo.db.data.count()}</strong> documents were inserted into the DB.<br><br>"
		f"Let's query the data in mongo and return it"
        f"<ul><li><a href='http://127.0.0.1:5000/api/v1.0/querydata'>Click me</a><br/></li></ul>"
        )

@app.route("/api/v1.0/chart")
def insertchart():
	cursor = mongo.db.data.find({"location": {"$exists": True}})
	# Expand the cursor and construct the DataFrame
	df =  pd.DataFrame(list(cursor))
	
	selcol_df = df[['created_date', 'closed_date','borough','city', 'status', 'resolution_action_updated_date']]
	selcol_df= selcol_df.drop_duplicates()
	
	selcol_df = selcol_df[selcol_df.borough != "Unspecified"]
	pothol_status = pd.DataFrame(selcol_df.groupby(["borough", "status"]).size())
	pothol_status = pothol_status.rename(index=str, columns={0: "count"})
	potdf = pothol_status.reset_index()
	#filter status column as open/closed/pending
	stopen=potdf[potdf['status']=="Open"]
	stclosed=potdf[potdf['status']=="Closed"]
	stpending=potdf[potdf['status']=="Pending"]

	# # Generate the plot trace
	trace1 = {
		
	 	"openx": stopen['borough'].tolist(),
	 	"openy": stopen['count'].tolist(),
		"closedx": stclosed['borough'].tolist(),
	 	"closedy": stclosed['count'].tolist(),
		 "pendingx": stpending['borough'].tolist(),
	 	"pendingy": stpending['count'].tolist()
	 }
	 
	return jsonify(trace1)

	









@app.route("/api/v1.0/getgifs")
def gifData():
	apikey = "XULANA80OWN0"
	lmt = 8

	r = requests.get("https://api.tenor.com/v1/anonid?key=%s" % apikey)

	if r.status_code == 200:
		anon_id = json.loads(r.content)["anon_id"]
	else:
		anon_id = ""

	search_term = "potholes"

	r = requests.get(
    	"https://api.tenor.com/v1/search?q=%s&key=%s&limit=%s&anon_id=%s" % (search_term, apikey, lmt, anon_id))

	if r.status_code == 200:
		top_8gifs = json.loads(r.content)
		
		return jsonify(top_8gifs)
	else:
		top_8gifs = None
	
if __name__ == '__main__':
	app.run(debug=True)