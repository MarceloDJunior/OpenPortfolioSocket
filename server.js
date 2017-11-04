const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (client) => {

    client.on('disconnect', () => {
        client.disconnect(true);
    });

    client.on('subscribeToNotifications', (user_id) => {
        client.leave(user_id);
        client.join(user_id);
    });

    client.on('sendNotificationTo', (data) => {
        let json = JSON.parse(data);
        let notification = JSON.parse(json.notification);
        client.broadcast.to(notification.usuario_destino.codigo).emit("new notification", notification);
    });

});


