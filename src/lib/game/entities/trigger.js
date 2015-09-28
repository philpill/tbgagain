ig.module(
    'game.entities.trigger'
)
.requires(
    'plusplus.entities.trigger'
)
.defines(function(){

    ig.EntityTrigger = ig.global.EntityTrigger = ig.EntityTrigger.extend({

        check: function( other ) {
            // Iterate over all targets
            for( var t in this.target ) {
                var ent = ig.game.getEntityByName( this.target[t] );

                if( ent && ent instanceof EntityLevelchange ) {

                    ig.game.success();
                }
            }
        }
    });
});