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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Emitter.instance.registerEvent(EVENT_NAME.CHECK_POSITION,this.sendResult)
    },
    sendResult(data){
        const sendObject = {
            isHit:true,
            shipLength:0,
            worldPosition:data.position
        };
        Emitter.instance.emit(EVENT_NAME.SEND_RESULT,sendObject)
    },
    start () {

    },

    // update (dt) {},
});
