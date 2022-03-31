// Initialize the map and set coordinates and zoom
var map = L.map('map').setView([51.96, 7.63], 12);

// Add tile layer with map from OpenStreetMap
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

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
