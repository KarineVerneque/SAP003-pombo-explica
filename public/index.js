// Instantiate a map and platform object:
let platform = new H.service.Platform({'apikey': 'tZhODf6mVOg1j5L7qpwf6FUaVjw2JTGUylNC2EtXc78'});

// Obtain the default map types from the platform object:
let defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
let map = new H.Map(
    document.getElementById('map'),
    defaultLayers.vector.normal.map,
        {
            zoom: 12,
            center: { lat: -23.55, lng: -46.65 }
        }
);

let ui = H.ui.UI.createDefault(map, defaultLayers, 'pt-BR'); // zoom/ escala/ tipo


// GEOCODING

// Create the parameters for the geocoding request:
let geocodingParams = {
    searchText: 'são paulo'
}; 
  
// Define a callback function to process the geocoding response:
let onResult = function(result) {
    let locations = result.Response.View[0].Result,
    position;

    // Add a marker for each location found
    for (i = 0;  i < locations.length; i++) {
        position = {
        lat: locations[i].Location.DisplayPosition.Latitude,
        lng: locations[i].Location.DisplayPosition.Longitude
        };
        map.setCenter(position);
    }
};
  
// Get an instance of the geocoding service:
let geocoder = platform.getGeocodingService();
  
// the callback and an error callback function 
geocoder.geocode(geocodingParams, onResult, function(e) {
    alert(e);
});
  

// EVENTO

let mapEvents = new H.mapevents.MapEvents(map);

// Add event listeners:
map.addEventListener('tap', function(evt) {
    console.log(evt.type, evt.currentPointer.type); 
    let bubble = new H.ui.InfoBubble({ lat: -23.55, lng: -46.65 } , {
        content: '<b>Hello World!</b>'
       });
    ui.addBubble(bubble);
});
  
// Instantiate the default behavior, providing the mapEvents object: 
let behavior = new H.mapevents.Behavior(mapEvents);

const search = (event) => {
    event.preventDefault();
    const endereco = document.getElementById('endereco').value
    geocodingParams = {
        searchText: `${endereco}, São Paulo, Brazil`
    };
    map.setZoom(17);
    geocoder.geocode(geocodingParams, onResult)
}

const form = document.getElementById('form');
form.addEventListener('submit', search);


const db = firebase.firestore()
db.collection("monumentos").get()
    .then((snap) => snap.forEach((monumento) => {
        let coords = { lat: monumento.data().local[0], lng: monumento.data().local[1] }
        let marker = new H.map.Marker(coords);

        map.addObject(marker);
    }))