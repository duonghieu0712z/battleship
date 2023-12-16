const Emitter = require('Events/EventEmitter');

cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {
        cc.log(Emitter);
        Emitter.instance = new Emitter();
    },

    start() {

    },

    update(dt) { },
});
