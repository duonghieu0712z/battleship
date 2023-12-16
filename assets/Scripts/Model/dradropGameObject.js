const Emitter = require('EventEmitter');
cc.Class({
    extends: cc.Component,

    properties: {
        map: cc.Node,
        container: cc.Node,
        isAvailable: false,
        touchDelay: 0.2,
    },

    onLoad() {
        this.offset = cc.Vec2.ZERO;
        this.isDragging = false;
        this.isDoubleClick = false;
        this.count=0;
        this.lastTouchTime=0;
        this.convertPos = new cc.Vec2();
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
        Emitter.instance.registerEvent("setAvailable", this.setAvailable.bind(this));
        this.node.getComponent("Ship").playanimOnWater();
    },

    onTouchStart(event) {
        cc.log("start");
        this.node.getChildByName("shipSprite").stopAllActions();
        if (this.node.parent == this.container) {
            this.container.getComponent(cc.Layout).active = false;
            this.node.parent = this.container.parent.parent;
            this.node.position = new cc.Vec2(this.node.x + this.container.x + this.container.parent.x, this.node.y + this.container.y + this.container.parent.y);
        }
        this.isDragging = true;
        const worldPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.offset = this.node.position.sub(worldPos);
        // let  currentTime = new Date().getTime();
        // if (currentTime - this.lastTouchTime < this.touchDelay * 1000) {
        //     this.node.getComponent("Ship").changeRotation();
        //     this.isDoubleClick=true;
        // }
    },

    onTouchMove(event) {
        cc.log("dra");
        if (!this.isDragging) return;
        const worldPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = worldPos.add(this.offset);
        let shipPos = new cc.Vec2(this.node.x - this.map.x, this.node.y - this.map.y);
        this.convertPosition(shipPos);
    },

    onTouchEnd(event) {
        cc.log("có chạy tochend");
        let prevTouch = this.lastTouchTime ? this.lastTouchTime : 0;
        this.lastTouchTime =Date.now();
        if(this.lastTouchTime - prevTouch < 500){
          this.isDoubleClick=true;
          cc.log("doubleTap");
          this.node.getComponent("Ship").changeRotation();
        } else {
            this.isDoubleClick=false;
           this.endTochAction();
        }
        let currentTime = new Date().getTime();
        this.lastTouchTime = currentTime;
    },
    convertPosition(shipPos) {
        let posX = shipPos.x - 30;
        let posY = shipPos.y + 30;
        let stepX = Math.round(posX / 55);
        let stepY = Math.round(posY / 55);
        let newPos = new cc.Vec2(stepX * 55, stepY * 55);
        this.node.getComponent("Ship").calculatePosition(stepX, stepY * -1);
        this.convertPos = new cc.Vec2(newPos.x + this.map.x + 30, newPos.y + this.map.y - 30);
    },
    setAvailable(data) {
        if (this.node.getComponent("Ship").shipId == data.shipId) {
            cc.log("data",data);
            cc.log("isdraging",this.isDragging);
            this.isAvailable = data.isAvailable;
            cc.log("isdouble click",this.isDoubleClick);
            if(this.isDoubleClick){
                this.endTochAction();
                this.isDoubleClick=false;
            }
        }
    },
    endTochAction(){
        this.node.position = this.convertPos;
        this.isDragging = false;
        if (this.isAvailable == false) {
            this.container.getComponent(cc.Layout).active = true;
            this.node.parent = this.container;
            this.node.x = 0;
            this.node.getComponent("Ship").isHorizontal = true;
            this.node.rotation = 0;
            Emitter.instance.emit('clear',{shipId: this.node.getComponent("Ship").shipId});
            Emitter.instance.emit('clearShipId',this.node.getComponent("Ship").shipId);
        }else{
            Emitter.instance.emit('setShipId', { positions: this.node.getComponent("Ship").positions, shipId: this.node.getComponent("Ship").shipId });
        }
        this.node.getComponent("Ship").playanimOnWater();
    },
    turnOffListener(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
    }
});
