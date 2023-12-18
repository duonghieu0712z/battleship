const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        this.W();
    },

    // update (dt) {},

    Y(){
        Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL);
    },
    E(){
        Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL);
    },
    W(){
        Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY);
    }
});
