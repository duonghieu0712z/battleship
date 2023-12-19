const Emitter = require("EventEmitter");
cc.Class({
    extends: cc.Component,

    properties: {
       shipPefab:[cc.Prefab],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.shipBool={};
        Emitter.instance.registerEvent("addShipBool", this.setShip.bind(this));
        // Emitter.instance.registerEvent("showShip", this.showShip.bind(this));
    },

    start () {
      
    },

   setShip(data){
    let shipIndex=this.shipPefab.length-data.length;
    let ship=cc.instantiate(this.shipPefab[shipIndex]);
    ship.parent=this.node;
    cc.log(data.position);
    ship.position=data.position;
    if(!data.isHorizontal){
        ship.rotation=90;
    }
    this.shipBool[data.shipId]=ship;
    ship.getComponent("EnemyShipDisplay").displayShip(false);
   },
   showShip(data){
       cc.tween(this.node)
           .delay(3)
           .call(()=>{
               this.shipBool[data.shipId].getComponent("EnemyShipDisplay").displayShip(true);
           }).start()
   }
});
