// var config = require('./config');

var config = {

    MAX_PLAYERS : 4,
    KILL_TIMEOUT : 180000
};

function getOtherPlayers (id) {

    console.log('getOtherPlayers()');

    // console.log('id ', id);

    // console.log('players ', players);

    var otherPlayers = {};

    for (var playerId in players) {

        if (playerId !== id) {

            // console.log('playerId ', playerId);
            // console.log('id ', id);

            console.log(players[playerId]);

            otherPlayers[playerId] = players[playerId];

            delete otherPlayers[playerId].socket;
        }
    }

    // console.log(otherPlayers);

    return otherPlayers;
}

function getPlayersArray () {

    // console.log('getPlayersArray()');

    var playersArray = [];

    var ids = Object.keys(players);

    ids.forEach(function (id) {

        playersArray.push(players[id]);
    });

    // console.log(playersArray);

    return playersArray;
}

function getPlayerCount () {

    return getPlayersArray().length;
}

function getPlayerNumbers () {

    console.log('getPlayerNumbers()');

    var numbers = [];

    var players = getPlayersArray();

    players.forEach(function (player) {

        if (!isNaN(player.playerNumber)) {

            numbers.push(player.playerNumber);
        }
    });

    console.log(numbers);

    return numbers.sort();
}

function getPlayerNumber () {

    var playerNumber = 0;

    var usedNumbers = getPlayerNumbers();

    for (var i = 0, j = config.MAX_PLAYERS; i < j; i++) {

        if (usedNumbers.indexOf(i) < 0) {

            playerNumber = i;
            break;
        }
    }

    return playerNumber;
}

function disconnectPlayer (id) {

    console.log('disconnectPlayer()');

    console.log('id ', id);

    var player = players[id];

    // console.log(player);

    var socket = getPlayerSocket(id);

    if (socket) {

        socket.emit('disconnectPlayer');

        socket.disconnect();
    }

}

function getPlayerSocket(id) {

    return io.sockets.connected[id];
}

function removePlayer (id) {

    players[id] = null;

    delete players[id];
}

function getLatency (oldValue, newValue) {

    var latency = oldValue;

    if (!newValue) {

        latency = null;

    } else if (newValue > oldValue) {

        latency = newValue;

    } else if (newValue < oldValue) {

        latency = Math.round((newValue + oldValue)/2);
    }

    return latency;
}

var players = {};

var io;

function init (socketio) {

    io = socketio;

    socketio.sockets.on('connection', function (socket) {

        console.log('a user connected');

        var playerNumber;

        var start;

        function sendPing () {

            start = Date.now();

            socket.emit('ping', socket.latency);

            setTimeout(sendPing, 1000);
        }

        socket.on('pong', function () {

            var latency = Date.now() - start;

            // console.log('ping ' + latency + 'ms');

            socket.latency = socket.latency ? getLatency(socket.latency, latency) : latency;
        });

        sendPing();

        function onDisconnect () {

            console.log('user disconnected');

            removePlayer(socket.id);

            socket.broadcast.emit('playerDisconnect', {
                id : socket.id
            });
        }

        function onPlayerMove (data) {

            // console.log('playerMove');

            // console.log(data);

            // broadcast that out to everyone else

            socket.broadcast.emit('playerMove', {
                id : socket.id,
                pos : data.pos,
                vel : data.vel,
                time : data.time
            });

            // clear timeout

            if (this.killtimeout) {

                clearTimeout(this.killtimeout);
            }

            //start new timeout

            this.killtimeout = setTimeout(function () {

                disconnectPlayer(socket.id);

            }, config.KILL_TIMEOUT);
        }


        function onGameStart (callback) {

            console.log('gameStart');

            if (getPlayerCount() < config.MAX_PLAYERS) {

                players[socket.id] = {
                    id : socket.id,
                    pos : {
                        x : 0,
                        y : 0
                    },
                    vel : {
                        x : 0,
                        y : 0
                    }
                }

            } else {

                console.log('max players - no free slots');
            }

            playerNumber = getPlayerNumber();

            players[socket.id].playerNumber = playerNumber;

            callback({

                playerNumber : playerNumber
            });
        }


        function onPlayerStart () {

            console.log('playerStart');

            if (getPlayerCount() < config.MAX_PLAYERS) {

                socket.emit('initialisePlayer', {
                    otherPlayers : getOtherPlayers(socket.id),
                    playerNumber : playerNumber
                });

                socket.broadcast.emit('newPlayer', {
                    id : socket.id,
                    playerNumber : playerNumber
                });

            } else {

                console.log('max players - no free slots');
            }
        }

        socket.on('disconnect', onDisconnect);
        socket.on('playerMove', onPlayerMove);
        socket.on('gameStart', onGameStart);
        socket.on('playerStart', onPlayerStart);
    });
}

module.exports = {

    init : init
};