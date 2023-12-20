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
        shipFailVideo: cc.VideoPlayer,
    },
    onLoad(){
        Emitter.instance.registerEvent(EVENT_NAME.PLAY_ANI_SHIP_FAIL,this.playClip.bind(this))
        this.shipFailVideo.node.on('completed', this.onVideoCompleted, this);
        //this.shipFailVideo.play();
        cc.log("hello clip")
    },
    playClip () {
        console.log("gfdd");
        this.shipFailVideo.node.active = true;
        this.shipFailVideo.play();
    },
    onVideoCompleted () {
        cc.log("hello")
        this.shipFailVideo.node.active = false;
        Emitter.instance.emit(EVENT_NAME.DONE_CLIP_SHIP_FAIL)
    }
});