ig.module(
    'game.entities.otherPlayer'
)
.requires(
    'plusplus.abstractities.player',
    'game.managers.animation',
    'plusplus.helpers.utils'
)
.defines(function() {

    var _ut = ig.utils;

    ig.EntityOtherPlayer = ig.global.EntityOtherPlayer = ig.Player.extend({

        name: 'player',

        size: {x: 10, y: 16},

        collides: ig.EntityExtended.COLLIDES.PASSIVE,

        setAnimations : function () {

            this.animationManager = new ig.animationManager();

            var animations = this.animationManager.getAnimations(this.playerNumber);

            this.anims['idleX'] = animations.idleX;
            this.anims['jumpX'] = animations.jumpX;
            this.anims['fallX'] = animations.fallX;
            this.anims['moveX'] = animations.moveX;

            this.animationManager = null;
        },

        animate : function (data) {

            this.vel = data.vel;

            this.pos = data.pos;
        },

        init : function (x, y, settings) {

            this.parent(x, y, settings);

            this.playerNumber = settings.playerNumber;

            this.setAnimations();
        },

        check : function (other) {

            console.log('otherPlayer.check()');

            console.log(other);

            this.parent();
        },

        initTypes: function() {

            _ut.addType(ig.EntityExtended, this, 'type', 'OTHERPLAYER');

            _ut.addType(ig.EntityExtended, this, 'checkAgainst', 'PLAYER');
        }
    });
});
