const express = require('express');
const socketIO = require('socket.io');

const path = require('path');

const PORT = process.env.PORT || 8080;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (client) => {

    client.on('disconnect', () => {
        console.log('user disconnected');
    });

    client.on('subscribeToNotifications', (user_id) => {
        console.log('client is subscribing to notifications ', user_id);
        client.join(user_id);
    });

    client.on('close', (user_id) => {
        client.leave(user_id);
        client.disconnect(true);
    });

    client.on('sendNotificationTo', (data) => {
        let json = JSON.parse(data);
        let notification = JSON.parse(json.notification);
        console.log("notification sent");
        client.broadcast.to(notification.usuario_destino.codigo).emit("new notification", notification);
    });

});


