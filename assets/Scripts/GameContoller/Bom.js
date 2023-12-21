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
        bomSprite: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.log(this.node.parent)
        Emitter.instance.registerOnce("attackToPosition", this.onAttack.bind(this));
    },
    start() {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on('finished', this.onAnimationFinished, this);
    },
    onAnimationFinished(data) {
        this.node.getComponent(cc.Sprite).spriteFrame = this.bomSprite;
    },
    onAttack(data) {
        cc.tween(this.node)
            .delay(0.94)
            .parallel(
                cc.tween().to(2,
                    {position:this.node.parent.convertToNodeSpaceAR(data.worldPosition)}),
                cc.tween().to(0.75, {scale: 2}, {easing: "sineOut"})
                    .then(cc.tween().to(1.25, {scale: 0.5}, {easing: "sineIn"})),
                cc.tween().to(2, {angle: 360 * 7}))
            .call(() => {
                //cc.log(this.node.position);
                this.playAnimationtileTarget(data)
                this.node.destroy();
            })
            .start();
    },
    playAnimationtileTarget(data) {
        Emitter.instance.emit(EVENT_NAME.PLAY_ANI,data)
    },
    onDestroy() {
        // cc.log("bom xoá")
    }
});
