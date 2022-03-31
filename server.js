const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/testpage.html'));
});

const port = 3000; //define port via which the application will be accessable
const bodyParser = require('body-parser'); 

//Parser for Requests
app.use(express.json()); 
app.use(express.urlencoded());

app.listen(3000, () => console.log('Example app is listening on port 3000.'));

//Folders
app.use(express.static(__dirname + '/html')); //define html folder
app.use(express.static(__dirname + '/routes')); //define router folder

//Routers
var addBoxRouter = require(__dirname + '/routes/add.js'); //require search router
app.use('/add', addBoxRouter); //instruct the server to use the router


var removeBoxRouter = require(__dirname + '/routes/delete.js'); //require search router
app.use('/delete', removeBoxRouter); //instruct the server to use the router



//Gets for webpages to be hosted
app.get("/test", (req, res) => { res.sendFile(__dirname + "/html/testpage.html"); });