// Initialize the map and set coordinates and zoom
var map = L.map('map', {drawControl: true}).setView([51.96, 7.63], 12);

// Add tile layer with map from OpenStreetMap
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var popup_content = 'Hallo welt';
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
               
    
        //   if (type === 'marker') {
            
        //   }
    
        // Do whatever else you need to. (save to db, add to map etc)
        map.addLayer(tempMarker);
    });
    

    

    map.on('click', function(e){

    })
