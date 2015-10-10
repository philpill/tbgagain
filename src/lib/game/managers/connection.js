ig.module(
    'game.managers.connection'
)
.requires(
    'impact.impact',
    'impact.game'
)
.defines(function(){

    ig.connectionManager = ig.Class.extend({

        onInitialisePlayer : function  (data) {

            console.log('ws: initialisePlayer');

            console.log(data);

            for (var player in data.otherPlayers) {

                var otherPlayer = data.otherPlayers[player];

                console.log(otherPlayer);

                this.game.spawnOtherPlayer(otherPlayer);
            }

            var player = this.game.getPlayer();

            player.playerNumber = data.playerNumber;

            player.playerName = 'bloody' + data.playerNumber;

            // player.id = this.socket.id;

            console.log(player);
        },

        onDisconnectPlayer : function  () {

            console.log('ws: disconnectPlayer');

            var player = this.game.getPlayer();

            if (player) {

                player.kill();
            }

            this.game.end();
        },

        onPlayerDisconnect : function  (data) {

            console.log('ws: playerDisconnect');

            console.log(data);

            this.game.removeOtherPlayer(data.id);
        },

        onPlayerMove : function  (data) {

            // console.log('ws: playerMove');

            // console.log(data);

            this.game.moveOtherPlayer(data);
        },

        onNewPlayer : function (player) {

            console.log('ws: newPlayer');

            console.log(player);

            this.game.spawnOtherPlayer(player);
        },

        onConnectError : function (error) {

            console.log('ws: connectError');

            console.log(error);

            this.game.end();

            this.game.socket.disconnect();
        },

        init : function () {

            console.log('connection.init()');

            this.game = ig.game;

            var socket = io();

            socket.on('initialisePlayer', this.onInitialisePlayer.bind(this));
            socket.on('disconnectPlayer', this.onDisconnectPlayer.bind(this));
            socket.on('playerDisconnect', this.onPlayerDisconnect.bind(this));
            socket.on('playerMove', this.onPlayerMove.bind(this));
            socket.on('newPlayer', this.onNewPlayer.bind(this));
            socket.on('connect_error', this.onConnectError.bind(this));

            socket.on('ping', function (latency) {

                console.log('ping ', latency);

                this.latency = latency;

                socket.emit('pong');
            });

            this.socket = socket;
        }
    });
});





