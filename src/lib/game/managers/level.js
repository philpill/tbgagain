ig.module(
    'game.managers.level'
)
.requires(
    'impact.impact',
    'impact.game',
    'game.levels.start',
    'game.levels.1'
)
.defines(function(){

    ig.levelManager = ig.Class.extend({

        levels : [
            LevelStart,
            Level1
        ],

        init : function () {

            this.current = 0;

            this.load();
        },

        next : function () {

            this.current++;

            this.current = this.current < this.levels.length ? this.current : 0;

            this.load();

            return this.current;
        },

        load : function (level) {

            level = typeof level !== 'undefined' ? level : this.current;

            ig.game.loadLevel(this.levels[level]);
        },

        reset : function () {

            this.current = 0;

            this.load();
        }
    });
});





