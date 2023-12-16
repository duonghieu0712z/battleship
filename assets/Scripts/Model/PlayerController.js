const Emitter = require('EventEmitter');
const EVENT_NAME = require("NAME_EVENT")

cc.Class({
    extends: cc.Component,

    properties: {
       map:cc.Node,
       shipBool:cc.Node
    },
     onLoad () {
        this.playerId=this.generateRandomId();
        this.registerEvent();
     },

    start () {

    },
    loadTheShip(){
        const allChildren = this.node.children[0].getChildren();
        this.ships = [];
        allChildren.forEach(child => {
            if (child.name === "ship") {
                this.ships.push(child.getComponent("Ship"));
            }
        });
        if(this.ships.length<4){
            cc.log("Vui lòng chọn đủ tàu")
        }else{
            Emitter.instance.emit("START",this.playerId);
            Emitter.instance.emit('SavePlayerId',this.playerId);
            this.shipBool.active=false;
            this.turnOffDraDrop();
        }
    },
    turnOffDraDrop(){
        this.ships.forEach(element=>{
            element.node.getComponent("dradropGameObject").turnOffListener();
        });
    },
    getShipById(shipId){
        for(let index=0;index<this.ships.length;index++){
            if(this.ships[index].shipId==shipId){
                return this.ships[index];
            }
        }
        this.ships.forEach(element=>{
            if(element.shipId==shipId){
                return element;
            }
        })
    },
    updateLength(shipId){
        let ship=this.getShipById(shipId);
        ship.length-=1;
        return ship.length;
    },
    responeResult(data){
        if(data.shipId==null){
            cc.log("hut");
            Emitter.instance.emit(EVENT_NAME.SEND_RESULT,{isHit:false,worldPosition:data.worldPosition});
        }else{
            let length=this.updateLength(data.shipId);
            if(length==0){
                cc.log("no");
                Emitter.instance.emit(EVENT_NAME.SEND_RESULT,{isHit:true,worldPosition:data.worldPosition,shipLength:length});
            }else{
                cc.log("trung");
                Emitter.instance.emit(EVENT_NAME.SEND_RESULT,{isHit:true,worldPosition:data.worldPosition,shipLength:length});
            }
        }
      
    },
    sendCoordinates(data){
    },
    checkPositon(data){
        cc.log(data);
         if(this.playerId==data.playerId){
            Emitter.instance.emit('checkTile',{playerId:this.playerId,position:data.position});
        }
    },
    generateRandomId() {
        return Math.floor(Math.random() * Date.now()).toString();
    },
    registerEvent(){
        Emitter.instance.registerEvent(EVENT_NAME.CHECK_POSITION, this.checkPositon.bind(this));
        Emitter.instance.registerEvent("receiveresult", this.responeResult.bind(this));
    }
});
