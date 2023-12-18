// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const Emitter = require("EventEmitter")
const EVENT_NAME = require("NAME_EVENT")
cc.Class({
    extends: cc.Component,

    properties: {
        coldDownTime: 11,
    },

    // LIFE-CYCLE CALLBACKS:

/*    onLoad() {
        this.coldDownAction = cc.tween(this.node)
            .sequence(cc.tween().call(() => {
                    cc.log(this.coldDownTime)
                    this.coldDownTime--;
                    this.node.getComponent(cc.Label).string = this.coldDownTime;
                },),
                cc.tween().delay(1),
            ).repeat(11)
            .call(() => {
                if (this.coldDownTime === 0){
                    //Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE_CLOCK)
                      //  Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE_CLOCK)
                }
            });
    },
    onEnable() {
        this.coldDownTime = 11;
        this.coldDownAction.start();
    },
    stopClock() {
        this.coldDownAction.stop();
    },

    start() {

    },*/

    // update (dt) {},
});
