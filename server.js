const io = require('socket.io')();

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

io.on('connection', (client) => {
    console.log('user connected');

    client.on('disconnect', () => {
        console.log('user disconnected');
        client.disconnect(true);
    });

    client.on('subscribeToNotifications', (user_id) => {
        console.log('client is subscribing to notifications ', user_id);
        client.leave(user_id);
        client.join(user_id);
        client.emit("receive code", user_id);
    });

    client.on('sendNotificationTo', (data) => {
        let json = JSON.parse(data);
        let notification = JSON.parse(json.notification);
        console.log("notification", notification);
        client.broadcast.to(notification.usuario_destino.codigo).emit("new notification", notification);
    });

});


