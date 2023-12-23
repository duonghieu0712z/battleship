const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        shipFailVideo: cc.VideoPlayer,
    },

    onLoad() {
        Emitter.instance.registerEvent(
            EVENT_NAME.PLAY_ANI_SHIP_FAIL,
            this.playClip.bind(this)
        );
        this.shipFailVideo.node.on("completed", this.onVideoCompleted, this);

        cc.log("hello clip");
    },

    playClip() {
        console.log("gfdd");
        this.shipFailVideo.node.active = true;
        this.shipFailVideo.play();
    },

    onVideoCompleted() {
        cc.log("hello");
        this.shipFailVideo.node.active = false;
        Emitter.instance.emit(EVENT_NAME.DONE_CLIP_SHIP_FAIL);
    },
});
