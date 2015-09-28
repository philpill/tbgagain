ig.module(
    'game.managers.animation'
)
.requires(
    'impact.impact',
    'impact.game'
)
.defines(function () {

    var playerAnimations = [{
        path : 'media/player-black.png',
        width: 10,
        height : 16,
        anims : {
            idleX : {
                sequence : [0],
                frameTime : 1
            },
            jumpX : {
                sequence : [4],
                frameTime : 0.2
            },
            fallX : {
                sequence : [4],
                frameTime : 0.2
            },
            moveX : {
                sequence : [3, 5, 6, 2],
                frameTime : 0.05
            }
        }
    },{
        path : 'media/player-red.png',
        width: 10,
        height : 16,
        anims : {
            idleX : {
                sequence : [0],
                frameTime : 1
            },
            jumpX : {
                sequence : [4],
                frameTime : 0.2
            },
            fallX : {
                sequence : [4],
                frameTime : 0.2
            },
            moveX : {
                sequence : [3, 5, 6, 2],
                frameTime : 0.05
            }
        }
    },{
        path : 'media/player-blue.png',
        width: 10,
        height : 16,
        anims : {
            idleX : {
                sequence : [0],
                frameTime : 1
            },
            jumpX : {
                sequence : [4],
                frameTime : 0.2
            },
            fallX : {
                sequence : [4],
                frameTime : 0.2
            },
            moveX : {
                sequence : [3, 5, 6, 2],
                frameTime : 0.05
            }
        }
    },{
        path : 'media/player-green.png',
        width: 10,
        height : 16,
        anims : {
            idleX : {
                sequence : [0],
                frameTime : 1
            },
            jumpX : {
                sequence : [4],
                frameTime : 0.2
            },
            fallX : {
                sequence : [4],
                frameTime : 0.2
            },
            moveX : {
                sequence : [3, 5, 6, 2],
                frameTime : 0.05
            }
        }
    }];

    ig.animationManager = ig.Class.extend({

        getAnimations : function (index) {

            var animation = playerAnimations[index];

            var animationSheet = new ig.AnimationSheet(animation.path, animation.width, animation.height);

            var idleX = new ig.AnimationExtended(animationSheet, { sequence: animation.anims.idleX.sequence, frameTime: animation.anims.idleX.frameTime } );
            var jumpX = new ig.AnimationExtended(animationSheet, { sequence: animation.anims.jumpX.sequence, frameTime: animation.anims.jumpX.frameTime } );
            var fallX = new ig.AnimationExtended(animationSheet, { sequence: animation.anims.fallX.sequence, frameTime: animation.anims.fallX.frameTime } );
            var moveX = new ig.AnimationExtended(animationSheet, { sequence: animation.anims.moveX.sequence, frameTime: animation.anims.moveX.frameTime } );

            return {
                idleX : idleX,
                jumpX : jumpX,
                fallX : fallX,
                moveX : moveX
            }
        }
    });
});





