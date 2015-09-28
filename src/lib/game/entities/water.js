ig.module(
    'game.entities.water'
)
.requires(
    'impact.entity',
    'plusplus.core.entity'
)
.defines(function() {

    EntityWater = ig.EntityExtended.extend({

        size: { x: 32, y: 32 },

        checkAgainst: ig.Entity.TYPE.BOTH,

        init: function (x, y, settings) {

            this.parent(x, y, settings);
        },

        update: function() {

            this.parent();
        },

        check : function (other) {

            console.log('check()');

            console.log(other);

            this.parent();

            if (other.name === 'player') {

                // end game

                other.kill();

                window.setTimeout(function () {

                    ig.game.end();

                }, 1000);

            }
        },
    });
});
