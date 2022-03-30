const express = require('express');

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

//Gets for webpages to be hosted
app.get("/test", (req, res) => { res.sendFile(__dirname + "/html/testpage.html"); });