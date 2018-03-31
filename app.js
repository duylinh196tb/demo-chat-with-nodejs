var express = require("express");

var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var Users = [];


app.get("/", function (req, res) {
    res.render("index");
})

io.on("connection", function (socket) {
    console.log("Co nguoi ket noi" + socket.id);
    socket.on("client-send-username", function (data) {
        if (Users.indexOf(data) >= 0) {
            // fail
            socket.emit("registerFail", data);
        } else {
            //successc
            Users.push(data);
            socket.emit("registerSuccess", data)

            //danh sach online

            socket.UserName = data;
            io.sockets.emit('list-online', Users);
        }
        console.log(data);
    })

    //logout
    socket.on("client-logout", function () {
        Users.splice(Users.indexOf(socket.UserName), 1)
        io.sockets.emit('list-online', Users);
    })

    //chat
    socket.on('client-send-message', function (data) {
        io.sockets.emit('server-send-data', { un: socket.UserName, data: data })
    })

    //typing
    socket.on('someone-typing', function () {
        socket.broadcast.emit('someone-typing')
        console.log('co ai dang go chu');
    })
    socket.on('someone-stop-typing', function () {
        console.log('ai do ngung go chu');
        socket.broadcast.emit('someone-stop-typing')
    })
})
