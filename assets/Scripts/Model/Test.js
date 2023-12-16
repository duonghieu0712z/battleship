const Ship = require('Ship');
const Emitter = require('EventEmitter');
cc.Class({
    extends: cc.Component,

    properties: {
    player:cc.Node
    },

    onLoad() {
        // cc.tween(this.node)
        // .to(1,{width:600})
        // .start()
        this.position = {
            x: 0,
            y: 0
        }
    },

    start() {
        // let a=new Ship(4,true);
        // a.calculatePosition(3,3);
        // cc.log(a.positions);
    },
    test() {
        Emitter.instance.emit('checkposition', {playerId:this.player.getComponent("PlayerController").playerId, position: this.position});
    }
    // update (dt) {},
});
