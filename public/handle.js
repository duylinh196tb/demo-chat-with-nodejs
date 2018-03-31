
var socket = io("http://localhost:3000")

$(function () {
    $("#loginForm").show();
    $("#chatForm").hide();

    $('#btnRegister').click(function () {
        socket.emit("client-send-username", $('#txtUserName').val());
    })

    //Dang ky tai khoan
    socket.on("registerFail", function (data) {
        alert("User: " + data + " da ton tai");
    })
    socket.on("registerSuccess", function (data) {
        $("#loginForm").hide(2000);
        $("#chatForm").show(1000);
        // alert("Hello "+ data);
        $('#currentUser').html(data);
    })

    //danh sach online
    socket.on('list-online', function (data) {
        $('#boxContent').html("");
        data.forEach(function (i) {
            $('#boxContent').append("<div class='listOnline'>" + i + "</div>");
        });
    })

    //logout
    $('#btnLogout').click(function () {
        socket.emit('client-logout');
        $("#loginForm").show(1000);
        $("#chatForm").hide(1000);
        $('#txtUserName').val("");
    })

    //chat
    $('#btnSendMessage').click(function () {
        socket.emit('client-send-message', $('#txtMessage').val());
    })

    socket.on('server-send-data', function (data) {
        $('#listMessage').append(`
        <div class="chat-body clearfix">
        <div class="header">
            <strong class="primary-font">${data.un}</strong>
        </div>
        <p>
            ${data.data}
        </p>
    </div>
        `);
        $('#txtMessage').val("");
    })

    //typing
    $('#txtMessage').focusin(function () {
        socket.emit('someone-typing')
    })
    $('#txtMessage').focusout(function () {
        socket.emit('someone-stop-typing')
    })

    socket.on('someone-typing', function () {
        $('#note').html("...");
    })
    socket.on('someone-stop-typing', function () {
        $('#note').html("");
    })





    

})

