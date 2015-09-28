ig.module(
    'game.entities.player'
)
.requires(
    'plusplus.abstractities.player',
    'plusplus.entities.conversation',
    'game.managers.animation',
    'plusplus.helpers.utils'
)
.defines(function () {

    var _ut = ig.utils;

    ig.EntityPlayer = ig.global.EntityPlayer = ig.Player.extend({

        name: 'player',

        collides: ig.EntityExtended.COLLIDES.PASSIVE,

        size: {x: 10, y: 16},

        setAnimations : function () {

            this.animationManager = new ig.animationManager();

            var animations = this.animationManager.getAnimations(this.playerNumber);

            this.anims['idleX'] = animations.idleX;
            this.anims['jumpX'] = animations.jumpX;
            this.anims['fallX'] = animations.fallX;
            this.anims['moveX'] = animations.moveX;

            this.animationManager = null;
        },

        speak : function (text) {

            if( ig.game.getEntitiesByClass(ig.EntityConversation)[0] ){

                ig.game.getEntitiesByClass(ig.EntityConversation)[0].kill();
            }
            var textbubble = ig.game.spawnEntity(ig.EntityConversation, 0, 0);

            textbubble.durationPerStepMin = 5;

            textbubble.addStep(text, this.name, 1);

            textbubble.activate();
        },

        init : function (x, y, settings) {

            this.parent(x, y, settings);

            this.playerNumber = settings.playerNumber;

            this.setAnimations();
        },

        kill : function () {

            this.parent();

            console.log('kill()');
        },

        update: function() {

            if (this.pos.x !== this.last.x || this.pos.y !== this.last.y) {

                ig.game.socket.emit('playerMove', {
                    playerId : ig.game.playerId,
                    pos : this.pos,
                    vel : this.vel
                });
            }

            this.parent();
        },

        check : function (other) {

            console.log('player.check()');

            console.log(other);

            this.parent();
        },

        initTypes: function() {

            _ut.addType(ig.EntityExtended, this, 'type', 'PLAYER');

            _ut.addType(ig.EntityExtended, this, 'checkAgainst', 'OTHERPLAYER');
        },

        check : function (other) {

            console.log('player.check()');

            console.log(other);

            this.parent();
        },
    });
});
