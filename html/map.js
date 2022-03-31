// Initialize the map and set coordinates and zoom
var map = L.map('map', {drawControl: true}).setView([51.96, 7.63], 12);

// Add tile layer with map from OpenStreetMap
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



var drawnItems = new L.FeatureGroup().addTo(map);
var drawControl = new L.Control.Draw({
         draw: {
             polygon: false,
             circle:false,
             circlemarker:false,
             polyline:false,
             rectangle:false
         },
          edit: {
              featureGroup: drawnItems
          }
      });
      drawControl.addTo(map);

      map.on('draw:created', function (e) {
        var tempMarker = e.layer.addTo(map);
        var coordinates = e.layer._latlng;
        console.log(coordinates);
        var popupContent =  `<div>   
<div>
  <form id="addBoxForm" action="/add/addBox" method="post">
    <label for="Name">Name</label><br>
    <input id="Name" name="name"><br>

    <label for="Kommentar">Kommentar</label><br>
    <input id="Kommentar" name="commentary"><br>

    <label for="Datum">Datum</label><br>
    <input id="Datum" name="date" type="date"><br>

    <label for="Strasse">Strasse</label><br>
    <input id="Strasse" name="street"><br>

    <label for="Hausnummer">Hausnummer</label><br>
    <input id="Hausnummer" name="house_number"><br>

    <input type="hidden" id="items" name="items" size="40"><br>

    <input type="submit" value="Box hinzufuegen">
  </form> 

  <div>
    <table id="itemsTable" class="table">
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Beschreibung</th>
            </tr>
        </thead>
        <tBody id="itemsTableBody"></tBody>
    </table>    
  </div>


  <label for="itemName">Name</label><br>
  <input id="itemName" name="street"><br>
  <label for="descr">Beschreibung</label><br>
  <input id="descr" name="descr"><br>
  <button type="button" value="Item zu Box hinzufuegen" onclick="getItemFromForm()">Item Hinzufuegen</button>
</div>`;
            console.log(popupContent);
            
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
getBoxes(); //retrieve data

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
    console.log(string)
    document.getElementById("items").value += string 
    buildItemTable()
}

function buildItemTable() {
    console.log(document.getElementById("items").value)
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
