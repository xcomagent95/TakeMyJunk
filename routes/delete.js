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
router.post('/removeBox', function (req, res, next) {

  console.log("Deleted a Box!")

  var boxName = req.body.name

  //Check if Name exists
  client.connect(function(err)
    {
        const db = client.db(dbName)
        const collection = db.collection(boxesCollection)

        collection.find({name: boxName}).toArray(function(err, docs)
        {      
            if(docs.length >= 1){ //if the locations exists and is not in use
                collection.deleteOne({name: boxName}, function(err, results){ //delte the location from the locations collection
                })
                res.sendFile(__dirname + "/done.html"); //send positive response -> the post operation war successful
                return;
              }
            else { //if the location does not exist
                res.sendFile(__dirname + "/done.html"); //send nonexistent location error
                return;
            }
        })
    })
});

module.exports = router; //export as router