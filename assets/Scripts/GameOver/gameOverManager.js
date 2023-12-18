const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");
cc.Class({
    extends: cc.Component,

    properties: {
        winPanel: cc.Node,

        losePanel: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var _openWinPanel = this.openWinPanel.bind(this);
        var _openLosePanel = this.openLosePanel.bind(this);

        Emitter.instance.registerEvent(EVENT_NAME.WIN, _openWinPanel);
        Emitter.instance.registerEvent(EVENT_NAME.LOSE, _openLosePanel);
    },

    start () {
        this.winPanel.active = false;

        this.losePanel.active = false;
    },

    // update (dt) {},

    openWinPanel(){
        this.winPanel.active = true;
    },

    openLosePanel(){
        this.losePanel.active = true;
    },
});
