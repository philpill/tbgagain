ig.module(
    'game.managers.ui'
)
.requires(
    'impact.impact',
    'impact.game'
)
.defines(function(){

    var logTimeout = 3000;

    ig.uiManager = ig.Class.extend({

        getVariableTimeout : function (count) {

            return logTimeout - (count * 100);
        },

        clearLogs : function () {

            this.logs = [];
        },

        log : function (text) {

            this.logs.push(text);

            this.displayLogs();
        },

        processLogs : function () {

            window.setTimeout((function () {

                this.logs = this.logs.splice(1, 1);

                this.displayLogs();

                this.processLogs();

            }).bind(this), this.getVariableTimeout(this.logs.length));
        },

        displayLogs : function () {

            this.messages.text = this.logs.length ? this.logs.join('\n') : '';
        },

        init : function () {

            this.game = ig.game;

            this.messages = ig.game.spawnEntity(ig.UIText, 0, 0, {

                font : this.game.font,

                textAlign : 'left',

                text : ''
            });

            this.logs = [];

            this.processLogs();
        }
    });
});





