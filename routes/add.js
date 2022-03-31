"use strict"

var express = require('express'); //require express
const app = express(); //initialize express app
var router = express.Router(); //initialize express-router

//Here we are configuring express to use body-parser as middle-ware
app.use(express.json());
app.use(express.urlencoded());

//MongoClient and DB
const url = 'mongodb://localhost:27017' // connection URL for local use
const dbName = 'takemyjunk' // database name
const boxesCollection = 'boxes' // collection containing the locations
const MongoClient = require('mongodb').MongoClient;
const { stringify } = require('querystring');
const client = new MongoClient(url) // mongodb client

//Post Location - this post operation can be used to store new locations in the locations collection
router.post('/addBox', function (req, res, next) {

  console.log("Submitted a Box!")
  console.log(req.body)

  var name = req.body.name
  var commentary = req.body.commentary
  var date = req.body.date
  var street = req.body.street
  var house_number = req.body.house_number
  var coordinates = req.body.coordinates
  console.log(coordinates);

  var items = JSON.parse('[' + req.body.items.slice(0, -1) + ']')

  var box = '{"type": "FeatureCollection","features": [{"type": "Feature","properties": {"commentary":"' + commentary + 
  '", "date":"' + date + 
  '", "street":"' + street + 
  '", "house_number":"' + house_number + 
  '"},"geometry": {"type": "Point","coordinates": '+coordinates+'}}]}'

  console.log("box");
  console.log(box);

  var obj = JSON.parse(box);
  //Check if Name exists
  client.connect(function(err) 
  {
    const db = client.db(dbName) //database
    const collection = db.collection(boxesCollection) //locations collection

    collection.find({name: name}).toArray(function(err, docs)
    {
      if(docs.length >= 1) { //if a location with the same locationID already exists
        res.sendFile(__dirname + "/error.html"); //send a redundant key error
        return;
      } else {
        //Insert the document in the database
        collection.insertOne({name, obj, items}, function(err, result) //insert new location into collection
        {
          res.sendFile(__dirname + "/done.html"); //send positive response -> the post operation war successful
          return;
         })
    }
  }) })
});

module.exports = router; //export as router