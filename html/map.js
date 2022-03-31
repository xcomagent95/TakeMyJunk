// Initialize the map and set coordinates and zoom
var map = L.map('map', {drawControl: true}).setView([51.96, 7.63], 12);

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
