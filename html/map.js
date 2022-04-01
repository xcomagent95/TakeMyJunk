// Initialize the map and set coordinates and zoom
var map = L.map('map').setView([51.96, 7.63], 12);

// Add tile layer with map from OpenStreetMap
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var drawnItems = new L.FeatureGroup().addTo(map);
var drawControl = new L.Control.Draw({
         draw: {
            polygon: false,
            circle: false,
            circlemarker: false,
            polyline: false,
            rectangle: false
            },
        edit: {
            featureGroup: drawnItems,
            edit: false,
            remove: false
        }
    }).addTo(map);

    map.on('draw:created', function (e) {
        var tempMarker = e.layer.addTo(map);
        var coordinates = e.layer._latlng;
        var popupContent =  `<div>   
                            <div>
                            <form id="addBoxForm" action="/add/addBox" method="post">
                                <br></br>
                                <label for="Name">Name</label><br>
                                <input id="Name" name="name"><br>
                                <label for="Kommentar">Commentary</label><br>
                                <input id="Kommentar" name="commentary"><br>
                                <label for="Datum">Date</label><br>
                                <input id="Datum" name="date" type="date"><br>
                                <label for="Strasse">Street</label><br>
                                <input id="Strasse" name="street"><br>
                                <label for="Hausnummer">House Number</label><br>
                                <input id="Hausnummer" name="house_number"><br>
                                <input type="hidden" id="items" name="items" size="40"><br>
                                <label for="Koordinaten">Coordinates</label><br>
                                <input id="Koordinaten" name="coordinates" value="[` + coordinates.lng + `,` +  coordinates.lat + `]" readonly>'
                                <input type="submit" value="Add Box">
                            </form> 
                            <div>
                                <table id="itemsTable" class="table">
                                    <thead>
                                        <tr>
                                            <br>
                                            <th scope="col">Name</th>
                                            <th scope="col">Desciption</th>
                                        </tr>
                                    </thead>
                                    <tBody id="itemsTableBody"></tBody>
                                </table>    
                            </div>
                            <label for="itemName">Name</label><br>
                            <input id="itemName" name="street"><br>
                            <label for="descr">Description</label><br>
                            <input id="descr" name="descr"><br>
                            <button type="button" value="Add Item to Box" onclick="getItemFromForm()">Item Hinzufuegen</button>
                            </div>`;    
        tempMarker.bindPopup(popupContent,{
            keepInView: true,
            closeButton: true
        }).openPopup(); 
        //   if (type === 'marker') {   
        //   }
        // Do whatever else you need to. (save to db, add to map etc)
        map.addLayer(tempMarker);
    });


var boxes
function getBoxes() { 
    {$.ajax({ //handle request via ajax
        url: "/search/getBoxes", //request url is the prebuilt request
        method: "GET", //method is GET since we want to get data not post or update it
        async: false //function does not return immediately, but has effect on a warning alert in the console
        })
        .done(function(res) { //if the request is done -> successful
            boxes = res; //retrieve locations from response
            return;
        })
        .fail(function(xhr, status, errorThrown) { //if the request fails (for some reason)
            return;
        })
        .always(function(xhr, status) { //if the request is "closed", either successful or not 
            return; 
        })
    }
}  
getBoxes()
console.log(boxes)

function addBoxMarker () {
    var lat;
    var long;
    var marker;
    var popupBoxContent;
    var items;
    var boxIcon = L.icon({
        iconUrl: 'g313.png',
        iconSize:     [32, 37], // size of the icon
        iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
    });
    for ( var i = 0; i<boxes.length;i++) {
        lat = boxes[i].obj.features[0].geometry.coordinates[1];
        long = boxes[i].obj.features[0].geometry.coordinates[0];
        console.log(lat);
        console.log(long);
        marker = new L.marker([lat, long], {icon: boxIcon}).addTo(map);
        // get array with items
        items = boxes[i].items;
        var itemsNames = [items[0].name];
        // extract only names from items and save in array
        for (var j=0; j<items.length; j++) {
            if (j != 0) {
            itemsNames = [itemsNames, items[j].name];
            }
        };
        popupBoxContent = "<b>Name: </b>" +boxes[i].name +
                        "<br> <b>Commentary: </b>" + boxes[i].obj.features[0].properties.commentary+
                        "<br> <b>Date: </b>" + boxes[i].obj.features[0].properties.date+
                        "<br> <b>Street: </b>"+boxes[i].obj.features[0].properties.street+
                        "<br> <b>House Number: </b>"+boxes[i].obj.features[0].properties.house_number+
                        "<br> <b>Items: </b>"+itemsNames+
                        "<input id='key' type='hidden' value="+ boxes[i].key+"></input>"+
                        "<br>"+
                        "<input id='userKey'></input>"+
                        "<button type='button' value='Item zu Box hinzufuegen' onclick='unlockBox()'>Unlock Box</button>"+
                        "<br>"+
                        "<div id='info'></div>"
                        '<form id="removeBoxForm" action="/delete/removeBox" method="post">\
                        <br><label for="fname">Name</label><br>\
                        <input id="Name" name="name"><br>\
                        <input type="submit" value="Löschen">\
                        </form>'+
                        '<form id="updateBoxForm" action="/update/updateBox" method="post">\
                        <br><label for="oldName">editiertes Objekt</label><br>\
                        <input id="oldName" name="oldName"><br>\
                        <label for="newName">Neuer Name</label><br>\
                        <input id="newName" name="newName"><br>\
                        <input type="submit" value="Aktualisieren">\
                        </form>'
        marker.bindPopup(popupBoxContent);
    }
}
addBoxMarker();

function getItemFromForm() {
    var itemName = document.getElementById("itemName").value
    var description = document.getElementById("descr").value
    
    var existingItems = document.getElementById("items").value
    var newItems = existingItems + '{"name":"' + itemName + '", "description":"' + description + '"},'

    document.getElementById("items").value = newItems
    buildItemTable()
}

function deleteItemFromTable(i){
    var items = JSON.parse('[' + document.getElementById("items").value.slice(0, -1) + ']')
    items.splice(i, 1)
    document.getElementById("items").value = ""
    var string = ""
    for(var i = 0; i < items.length; i++) { //iterate over table data
        string += JSON.stringify(items[i])
        string += ','    
    }
    document.getElementById("items").value += string 
    buildItemTable()
}

function buildItemTable() {
    //console.log(document.getElementById("items").value)
    var items = JSON.parse('[' + document.getElementById("items").value.slice(0, -1) + ']')
    var table = document.getElementById('itemsTableBody'); //get the the table containing the locations
    table.innerHTML = ""
    for(var i = 0; i < items.length; i++) { //iterate over table data
        //initialize table row as variable
        var row =  `<tr scope="row">
                        <td>${items[i].name}</td>
                        <td>${items[i].description}</td>
                        <td><button type="button" onclick="deleteItemFromTable(` + i + `)">Item löschen</button></td>
                    </tr>`
        table.innerHTML += row; //pass row into given table
    }
}

function unlockBox() {
    var key = document.getElementById('key').value
    var userKey = document.getElementById('userKey').value

    if(key == userKey) {
        document.getElementById('info').innerHTML = "Howdy partner! You seem to be allright..take what you need!"
    } 
    else {
        document.getElementById('info').innerHTML = "Oh boy! You seem to be a Stranger round here...better get lost!"
    }
}