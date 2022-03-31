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
router.post('/updateBox', function (req, res, next) {

  console.log("Udated a Box!")

  var oldName = req.body.oldName
  var newName = req.body.newName

  client.connect(function(err) 
  {
    const db = client.db(dbName) //database
    const collection = db.collection(boxesCollection) //locations collection

    collection.find({name: oldName}).toArray(function(err, docs)
    {
      if(docs.length >= 1) { //if a location with the same locationID already exists
        collection.updateOne({name: oldName}, {$set:{name: newName}}, function(err, result) 
              {
                res.send(`More junk? Where did you get all this stuff?`)
                return;
              })
        
            } else {
              res.send(`Woah slow down partner! Things went wild here!`)
              return;
    }
  }) })
 
});

module.exports = router; //export as router