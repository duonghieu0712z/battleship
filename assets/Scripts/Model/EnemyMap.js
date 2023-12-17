const Emitter = require('EventEmitter');
cc.Class({
    extends: cc.Component,

    properties: {
        rows: 8,
        cols: 8,
        tilePrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.map = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
        this.enemyId=null;
        this.creatMap();
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
        this.map[0][0].getComponent("Tile").isShooted=true;
    },
    onTouchEnd(event) {
        let touchPosGlobal = event.getLocation();
    let touchPosLocal = this.node.convertToNodeSpaceAR(touchPosGlobal);
    this.convertPosition(touchPosLocal);
    },
    convertPosition(pos) {
        let posX = pos.x - 30;
        let posY = pos.y + 30;
        let stepX = Math.round(posX / 55);
        let stepY = Math.round(posY / 55);
        let tile=this.map[stepY*-1][stepX];
        if(tile.getComponent("Tile").isShooted){
            cc.log("ô này đã bị bắn");
        }else{
            cc.log("Gửi cho player có thể bắn");
            Emitter.instance.emit('sendCoordinates',{x:stepX,y:-stepY});
        }
    },
    creatMap() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let tile = cc.instantiate(this.tilePrefab);
                this.map[i][j] = tile;
                tile.parent = this.node;
            }
        }
    },
    setShip(data){
        if(this.checkAvailable(data.arrayPos)){
            for (let i = 0; i < arrayPos.length; i++) {
                let tile=this.map[arrayPos[i].y][arrayPos[i].x];
                tile.getComponent("Tile").shipId=data.shipId;
            }
        }
    },
    checkAvailable(arrayPos) {
        for (let i = 0; i < arrayPos.length; i++) {
            if (arrayPos[i].y < 0 || arrayPos[i].y >= this.rows || arrayPos[i].x < 0 || arrayPos[i].x >= this.rows) {
                return false;
            }
            let tile=this.map[arrayPos[i].y][arrayPos[i].x];
            if(tile.getComponent("Tile").shipId!=null){
                return false;
            }
        }
        return true;
    },
    checkTile(data){
        if(this.enemyId==data.playerId){
         let node=this.map[data.position.y][data.position.x];
         let mapPosition = new cc.Vec2(node.x+this.node.x,node.y+this.node.y);
         let mapcotainerPosition = new cc.Vec2(mapPosition.x+this.node.parent.x,mapPosition.y+this.node.parent.y);
         let targetPosition = new cc.Vec2(mapcotainerPosition.x+this.node.parent.parent.x,mapcotainerPosition.y+this.node.parent.parent.y);
         let shipId=node.getComponent("Tile").shipId;
         Emitter.instance.emit('receiveresult',{playerId:this.enemyId,worldPosition:targetPosition,shipId:shipId});
        }
     }, 
});
