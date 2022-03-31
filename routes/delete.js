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
                res.send(`You still wanna use use your junk? Fine then!`)
                return;
              }
            else { //if the location does not exist
              res.send(`Woah slow down partner! Things went wild here!`)
                return;
            }
        })
    })
});

module.exports = router; //export as router