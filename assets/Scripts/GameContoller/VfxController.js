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
        bomPrefab: cc.Prefab,
        missPrefab: cc.Prefab,
        explosionShip: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.shipLenght = 0
        this.bom;
        this.isHit = false;
        Emitter.instance.registerEvent(EVENT_NAME.PLAY_ANI, this.playAnimation.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.DESTROY_ANI_NODE, this.destroyNode.bind(this));
        this.animation = null;
    },
    playAnimation(data) {
        this.isHit = data.isHit
        this.shipLength = data.shipLength
        cc.log('world vfx',data.worldPosition);
        this.bom = cc.instantiate(this.bomPrefab);
        let canvas = cc.find("Canvas")
        this.bom.setParent(canvas)
        cc.log(this.bom.parent)
        this.bom.position = canvas.convertToNodeSpaceAR(data.worldPosition)
        cc.log('canvas vfx',canvas.convertToNodeSpaceAR(data.worldPosition));
        if (this.isHit) {
            let myanimation = this.bom.getComponent(cc.Animation);
            myanimation.play(myanimation.getClips()[0].name)
            Emitter.instance.emit(EVENT_NAME.SOUND_EXPLOSION);
            if (this.shipLength !== 0)
                Emitter.instance.emit(EVENT_NAME.IS_SHOOT_SHIP, true);
        } else {
            let myanimation = this.bom.getComponent(cc.Animation);
            myanimation.play(myanimation.getClips()[1].name)
            Emitter.instance.emit(EVENT_NAME.SOUND_SHOOT_WATER);
            if (this.shipLength !== 0)
                Emitter.instance.emit(EVENT_NAME.IS_SHOOT_SHIP, false)
        }
    },
    destroyNode() {
        if (this.shipLength === 0) Emitter.instance.emit(EVENT_NAME.SHIP_FAIL)
        this.bom.destroy()
    }
    // update (dt) {},
});
