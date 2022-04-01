const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/testpage.html'));
});

const port = 3000; //define port via which the application will be accessable
const bodyParser = require('body-parser'); 

let apiKey = '985b7a47a9d9f0f648c09350682d585d';
let city = 'muenster';
let url = 'http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}';

//Parser for Requests
app.use(express.json()); 
app.use(express.urlencoded());

app.listen(3000, () => console.log('Example app is listening on port 3000.'));

//Folders
app.use(express.static(__dirname + '/html')); //define html folder
app.use(express.static(__dirname + '/routes')); //define router folder
app.use(express.static(__dirname + '/node_modules')); //define router folder

//Routers
var addBoxRouter = require(__dirname + '/routes/add.js'); //require search router
app.use('/add', addBoxRouter); //instruct the server to use the router

var removeBoxRouter = require(__dirname + '/routes/delete.js'); //require search router
app.use('/delete', removeBoxRouter); //instruct the server to use the router

var updateBoxRouter = require(__dirname + '/routes/update.js'); //require search router
app.use('/update', updateBoxRouter); //instruct the server to use the router

var searchBoxRouter = require(__dirname + '/routes/search.js'); //require search router
app.use('/search', searchBoxRouter); //instruct the server to use the router

//Gets for webpages to be hosted
app.get("/test", (req, res) => { res.sendFile(__dirname + "/html/testpage.html"); });

app.get('/weather', (req , res) => {
  request(url, function (err, response, body) {
       if(err){
         console.log('error:', error);
       } else {
         let weather = JSON.parse(body)
         let message = "It's ${weather.main.temp} degrees in ${weather.name}!";
         res.send(message);
       }
     });
})
