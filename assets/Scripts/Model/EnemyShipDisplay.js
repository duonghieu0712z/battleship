
cc.Class({
    extends: cc.Component,

    properties: {
        shipSprite:cc.Node
    },

  displayShip(isShow){
    this.shipSprite.active=isShow;
  }
});
