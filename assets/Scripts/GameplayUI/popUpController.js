const Emitter = require("EventEmitter");
cc.Class({
    extends: cc.Component,

    properties: {
        popUpPanel: cc.Node,

        popUpLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.popUpPanel.active = false;
        this.popUpLabel.node.active = false;

        var _openPopUp = this.openPopUp.bind(this);

        Emitter.instance.registerEvent("UI-popUp", _openPopUp);

    },

    // update (dt) {},

    openPopUp(data){
        this.popUpPanel.active = true;
        this.popUpLabel.node.active = true;

        this.popUpLabel.string = data;

        var action = cc.sequence(
            cc.delayTime(2),
            cc.callFunc(()=>{
                this.popUpPanel.active = false;
                this.popUpLabel.node.active = false;
            })
        )
        this.node.runAction(action);
    }
});
