const Emitter = require("EventEmitter");
cc.Class({
    extends: cc.Component,

    properties: {
       startButton:cc.Button,
    },
    onLoad () {

    },

    start () {
        this.startButton.interactable=false;
        Emitter.instance.registerEvent("checkShipInContainer", this.checkShipInContainer.bind(this));
    },
    checkShipInContainer(){
        let allChildren = this.node.getChildren();
       if(allChildren.length==0){
        this.startButton.interactable=true;
       }else{
        this.startButton.interactable=false;
       }
    }
});
