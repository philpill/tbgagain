ig.module(
	'game.main'
)
.requires(
    'plusplus.core.plusplus',
    'game.managers.connection',
    'game.managers.level',
    'game.managers.ui',
    'game.entities.otherPlayer',
    'game.entities.player',
    'impact.game',
    'impact.font',
    'impact.input',
    'plusplus.debug.debug'
)
.defines(function(){

    var _c = ig.CONFIG;

    MyGame = ig.GameExtended.extend({

    	// Load a font
    	font: new ig.Font( 'media/04b03.font.png' ),

    	init: function () {

            var that = this;

            this.parent();

            this.start();
        },

    	update: function() {
    		// Update all entities and backgroundMaps
    		this.parent();

            if (!this.player) {

                this.player = this.getPlayer();

                if (this.player) {

                    console.log(this.player);

                    this.socket.emit('playerStart');
                }
            }


            // Add your own, additional update code here
            if (ig.input.pressed('start')) {

                this.socket = this.connectionManager.init();

                this.levelManager.next();

                ig.input.unbind( ig.KEY.SPACE, 'start' );
                ig.input.unbind( ig.KEY.MOUSE1, 'start' );

                this.hasStarted = true;

                // get player number

                this.socket.emit('gameStart', (function (data) {

                    this.spawnPlayer(data);

                }).bind(this));

            }
        },

        spawnPlayer : function (data) {

            var game = this;

            window.setTimeout(function () {

                var spawn = game.getEntityByName('spawn');

                if (spawn) {

                    // console.log(spawn);

                    // console.log(spawn.pos);

                    game.spawnEntity( EntityPlayer, spawn.pos.x, spawn.pos.y, { playerNumber : data.playerNumber });

                    game.uiManager.log('start: player ' + data.playerNumber);

                    game.getPlayer().speak('wtf?');


                } else {

                    console.error('cannot find spawn point on level');
                }

            }, 700);
        },

        moveOtherPlayer : function (data) {

            // console.log('moveOtherPlayer()');

            // console.log(data);

            // cache this
            var player = this.getOtherPlayer(data.id);

            if (player) {

                player.animate(data);
            }
        },

        getOtherPlayer : function (id) {

            // console.log('getOtherPlayer()');

            // console.log('id ', id);

            return ig.game.getEntityByName(id);
        },

        removeOtherPlayer : function (id) {

            // console.log('removeOtherPlayer()');

            // console.log(id);

            var player = ig.game.getEntityByName(id);

            if (player) {

                ig.game.uiManager.log('exit: player ' + player.playerNumber);

                player.kill();
            }

        },

        spawnOtherPlayer : function (player, delaySpawn) {

            var timeout = delaySpawn ? 700 : 0;

            var that = this;

            window.setTimeout(function () {

                var spawn = ig.game.getEntityByName('spawn');

                var spawnPosition;

                if (player.pos) {

                    spawnPosition = {
                        x : player.pos.x,
                        y : player.pos.y
                    };

                } else if (spawn) {

                    spawnPosition = {
                        x : spawn.pos.x,
                        y : spawn.pos.y
                    };
                }

                if (spawnPosition) {

                    // console.log('spawnOtherPlayer()');

                    // console.log(player.id);

                    ig.game.uiManager.log('start: player ' + player.playerNumber);

                    ig.game.spawnEntity( EntityOtherPlayer, spawnPosition.x, spawnPosition.y, { id : player.id, name : player.id, playerNumber : player.playerNumber });

                } else {

                    console.error('cannot find spawn point on level');
                }

            }, timeout);
        },

    	draw: function() {
    		// Draw all entities and backgroundMaps
    		this.parent();

            if (!this.hasStarted) {

                // Add your own drawing code here
                var x = ig.system.width/2,
                    y = ig.system.height/2;

                this.uiManager.clearLogs();

                if (this.gameOver) {

                    var player = this.getPlayer();

                    if (player) {
                        this.removeEntity(player);
                    }

                    this.font.draw( 'Game Over!', x, y, ig.Font.ALIGN.CENTER );
                    this.font.draw( 'hit space to begin', x, y + 20, ig.Font.ALIGN.CENTER );

                    ig.input.bind( ig.KEY.SPACE, 'start' );
                    ig.input.bind( ig.KEY.MOUSE1, 'start' );

                } else {

                    this.font.draw( '-- That Bloody Game Again! --', x, y, ig.Font.ALIGN.CENTER );
                    this.font.draw( 'hit space to begin', x, y + 20, ig.Font.ALIGN.CENTER );
                }
            }
    	},

        success : function () {

            console.log('success()');

            if (this.levelManager.next() === 0) {
                this.end();
            }
        },

        start : function () {

            this.connectionManager = new ig.connectionManager();
            this.levelManager = new ig.levelManager();
            this.uiManager = new ig.uiManager();
            this.hasStarted = false;
            ig.input.bind( ig.KEY.SPACE, 'start' );
            ig.input.bind( ig.KEY.MOUSE1, 'start' );
        },

        end : function () {

            this.levelManager.reset();
            this.gameOver = true;
            this.hasStarted = false;
        },

        inputStart: function() {

            this.parent();

            ig.input.bind(ig.KEY.UP_ARROW, 'jump');
        },

        inputEnd: function() {

            this.parent();

            ig.input.unbind(ig.KEY.UP_ARROW, 'jump');
        },

        // In your game class; Overwrite load level do enable
        // pre-rendering on all background maps when a level
        // was loaded

        loadLevel: function( data ) {
            this.parent( data );

            for( var i = 0; i < this.backgroundMaps.length; i++ ) {
                this.backgroundMaps[i].preRender = true;
            }
        }
    });

    ig.main( '#canvas', MyGame, 60, _c.GAME_WIDTH, _c.GAME_HEIGHT, _c.SCALE, ig.LoaderExtended);

});
