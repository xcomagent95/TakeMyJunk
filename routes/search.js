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

router.get('/getBoxes', function(req, res, next) 
{
  //Connect to the mongodb database and retrieve all docs
  client.connect(function(err) 
  {
    const db = client.db(dbName); //Database
    const collection = db.collection(boxesCollection); //Collection

    // Find all documents
    collection.find({}).toArray(function(err, docs) 
    {
      res.json(docs); //return documents from Database
    })
  })
});
module.exports = router; //export as router