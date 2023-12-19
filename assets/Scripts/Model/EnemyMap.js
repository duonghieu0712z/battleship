const Emitter = require("EventEmitter");

const Ship = require("Ship");

cc.Class({
    extends: cc.Component,

    properties: {
        rows: 8,
        cols: 8,
        tilePrefab: cc.Prefab,
    },

    onLoad() {
        this.map = new Array(this.rows)
            .fill(null)
            .map(() => new Array(this.cols).fill(null));
        this.enemyId = null;
        this.creatMap();

        const onSetEnemyShipPos = this.setShip.bind(this);
        Emitter.instance.registerEvent("set-enemy-ship-pos", onSetEnemyShipPos);

        Emitter.instance.registerEvent("checkTile", this.checkTile.bind(this));

        Emitter.instance.registerEvent(
            "setEnemyId",
            (enemyId) => (this.enemyId = enemyId),
        );

        Emitter.instance.registerEvent("log-enemy-map", () =>
            cc.log(
                "random ship",
                this.map.map((row) =>
                    row.map((tile) => tile.getComponent("Tile").shipId),
                ),
            ),
        );
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.map[0][0].getComponent("Tile").isShooted = true;
    },

    onTouchEnd(event) {
        cc.log("co nhan");
        let touchPosGlobal = event.getLocation();
        let touchPosLocal = this.node.convertToNodeSpaceAR(touchPosGlobal);
        this.convertPosition(touchPosLocal);
    },

    convertPosition(pos) {
        let posX = pos.x - 30;
        let posY = pos.y + 30;
        let stepX = Math.round(posX / 55);
        let stepY = Math.round(posY / 55);
        cc.log(stepX,stepY)
        let tile = this.map[stepY * -1][stepX];
        if (tile.getComponent("Tile").isShooted) {
            cc.log("ô này đã bị bắn");
        } else {
            cc.log("Gửi cho player có thể bắn");
            Emitter.instance.emit("sendCoordinates", { x: stepX, y: -stepY });
        }
    },

    test() {
        // for (let i = 0; i < 4; i++) {
        //     let a = new Ship(4, true);
        //     let x=this.getRandomIntegerInRange(0,8);
        //     let y=this.getRandomIntegerInRange(0,8);
        //     a.calculatePosition(x, y,false);
        //     this.setShip({arrayPos:a.positions,shipId:a.shipId});
        // }
        this.node.active = !this.node.active;
    },

    getRandomIntegerInRange(minValue, maxValue) {
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
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

    setShip(data) {
        data.isSuccess = this.checkAvailable(data.arrayPos);
        if (data.isSuccess) {
            this.addToShipBool(data);
            for (let i = 0; i < data.arrayPos.length; i++) {
                let tile = this.map[data.arrayPos[i].y][data.arrayPos[i].x];
                tile.getComponent("Tile").shipId = data.shipId; 
            }
        }
    },
    addToShipBool(data){
        let anchorIndex=Math.floor(data.arrayPos.length/2);
        let stepX=data.arrayPos[anchorIndex].x;
        let stepY=data.arrayPos[anchorIndex].y+1;
        let position=new cc.Vec2(stepX*55+25,stepY*-55+25);
        let isHorizontal=true;
        if(data.arrayPos.length!=1){
            if(data.arrayPos[anchorIndex].y!=data.arrayPos[anchorIndex-1].y){
                isHorizontal=false;
            }
        }

        const ship = data.ship;
        ship.node.position=position;
        if(!ship.isHorizontal){
            ship.node.angle = -90;
        }
    },
    checkAvailable(arrayPos) {
        for (let i = 0; i < arrayPos.length; i++) {
            if (
                arrayPos[i].y < 0 ||
                arrayPos[i].y >= this.rows ||
                arrayPos[i].x < 0 ||
                arrayPos[i].x >= this.rows
            ) {
                return false;
            }
            let tile = this.map[arrayPos[i].y][arrayPos[i].x];
            if (tile.getComponent("Tile").shipId != null) {
                return false;
            }
        }
        return true;
    },

    checkTile(data) {
        if (this.enemyId == data.playerId) {
            let node = this.map[data.position.y][data.position.x];
            let mapPosition = new cc.Vec2(
                node.x + this.node.x,
                node.y + this.node.y,
            );
            let mapcotainerPosition = new cc.Vec2(
                mapPosition.x + this.node.parent.x,
                mapPosition.y + this.node.parent.y,
            );
            let targetPosition = new cc.Vec2(
                mapcotainerPosition.x + this.node.parent.parent.x,
                mapcotainerPosition.y + this.node.parent.parent.y,
            );
            let shipId = node.getComponent("Tile").shipId;
            cc.log("enemy ship", shipId);
            Emitter.instance.emit("receiveresult", {
                playerId: this.enemyId,
                worldPosition: targetPosition,
                shipId: shipId,
            });
            node.getComponent("Tile").isShooted = true;
            cc.tween(this.node)
                .delay(3)
                .call(() => {
                    node.getComponent("Tile").changeState();
                })
                .start();
        }
    },
});
