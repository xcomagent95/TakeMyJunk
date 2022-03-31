// Initialize the map and set coordinates and zoom
var map = L.map('map').setView([51.96, 7.63], 12);

// Add tile layer with map from OpenStreetMap
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var popupContent =  '<form id="addBoxForm" action="/add/addBox" method="post">'+
'<label for="fname">Name</label><br>'+
'<input id="Name" name="name"><br>'+
'<label for="fname">Kommentar</label><br>'+
'<input id="Kommentar" name="commentary"><br>'+
'<label for="fname">Datum</label><br>'+
'<input id="Datum" name="date" type="date"><br>'+
'<label for="fname">Strasse</label><br>'+
'<input id="Strasse" name="street"><br>'+
'<label for="fname">Hausnummer</label><br>'+
'<input id="Hausnummer" name="house_number"><br>'+
'<input type="submit" value="Submit">'+
'</form>';

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
        console.log(tempMarker);
        console.log(coordinates);
        tempMarker.bindPopup(popupContent,{
            keepInView: true,
            closeButton: false
            }).openPopup(); 
    
        //   if (type === 'marker') {
            
        //   }
    
        // Do whatever else you need to. (save to db, add to map etc)
        map.addLayer(tempMarker);
    });
    

    map.on('click', function(e){

    })

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
        popupBoxContent = "<b>Name: </b>" +boxes[i].name +
                        "<br> <b>Comment: </b>" + boxes[i].obj.features[0].properties.commentary+
                        "<br> <b>Date: </b>" + boxes[i].obj.features[0].properties.date+
                        "<br> <b>Street: </b>"+boxes[i].obj.features[0].properties.street+
                        "<br> <b>Street Number: </b>"+boxes[i].obj.features[0].properties.house_number+
                        "<br> <b>Items: </b>"+boxes[i].obj.features[0].properties.items+  
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

function buildItemTable() {
    var items = JSON.parse('[' + document.getElementById("items").value.slice(0, -1) + ']')
    var table = document.getElementById('itemsTableBody'); //get the the table containing the locations
    for(var i = 0; i < items.length; i++) { //iterate over table data
        //initialize table row as variable
        var row =  `<tr scope="row">
                        <td>${items[i].name}</td>
                        <td>${items[i].description}</td>
                        <td><button type="button">Item löschen</button></td>
                    </tr>`
        table.innerHTML += row; //pass row into given table
    }

}
