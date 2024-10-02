const express = require('express');
const app = express();
const path = require("path");
const http = require("http");


const cors = require('cors');
app.use(cors());


const socketio = require("socket.io");

const server = http.createServer(app);

const io = socketio(server);

io.setMaxListeners(20);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        //console.log("Server received location from", socket.id, data);
        io.emit("receive-location", {id: socket.id, ...data });
        //console.log("socketid", socket.id);
        io.on("error-connection", function (){
            console.log("ERROr");
        })
    })
    //console.log("connected", socket.id);

    socket.on("disconnect", function () {
        
        io.emit("user-disconnected", socket.id);
        //console.log("disconnected", socket.id);
    })
})

app.get("/", function (req, res) {
    res.render("index");
})

server.listen(3000, '0.0.0.0', () => {
    console.log("Server running on 0.0.0.0:3000");
});