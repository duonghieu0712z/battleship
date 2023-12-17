// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");
cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.myanimation = this.node.getComponent(cc.Animation);
        this.myanimation.on('finished', this.onAnimationFinished, this);
        // Bắt đầu chạy Animation
    },
    onAnimationFinished() {
        // cc.log("xong no hieu ung")
        Emitter.instance.emit(EVENT_NAME.DESTROY_ANI_NODE)
    },
    start() {

    },
    // update (dt) {},
});
