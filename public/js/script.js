const socket = io();
console.log("kaba");
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        console.log("Client-side location update:", position.coords);
        const { latitude, longitude } = position.coords;
        console.log("Emitting location from mobile:", { latitude, longitude });
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    },
{
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
});

}else{
    console.log("Geolocation not supported by browser");
}

const map = L.map("map").setView([0,0],16);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

console.log(markers.length,"MARKERS");

socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})