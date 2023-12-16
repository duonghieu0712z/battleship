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
        spritePrefab: cc.Prefab,
    },
    onLoad() {
        this.node.on("mousedown", this.onMouseDown, this);
    },
    /*onClick(data) {
        cc.log(data)
        if (this.hasShotInTile) return;
        if (this.node.getBoundingBoxToWorld().contains(data)) {
            let clickedChildNode = this.findClickedChildNode(this.node, data);
            if (clickedChildNode === null) return;
            cc.log(this.mapController.clickCounter)
            if (clickedChildNode.getComponent("Tile").hasShoot || this.mapController.clickCounter === 0) return;
            else {
                let worldPosition = clickedChildNode.parent.convertToWorldSpaceAR(clickedChildNode.position);
                cc.log("tile " + worldPosition)
                let targetNode = {
                    positionToTarget: worldPosition,
                    targetTile: clickedChildNode
                }
                clickedChildNode.getComponent("Tile").hasShoot = true;
                Emitter.instance.emit("spawnPrefab")
                Emitter.instance.emit(EVENT_NAME.STOP_CLOCK)
                //Emitter.instance.emit("attackToPosition", targetNode)
                this.mapController.clickCounter = 0;
            }

        }
    },
    onHoverChild(data) {
        let isShoot = data.currentTarget.getComponent("Tile").hasShoot;
        if (!isShoot) data.currentTarget.color = cc.Color.GREEN;

    },
    onLeftHoverChild(data) {
        cc.log(data.currentTarget.getComponent("Tile").hasShoot);
        let isShoot = data.currentTarget.getComponent("Tile").hasShoot;
        if (isShoot) return;
        data.currentTarget.color = cc.Color.WHITE;
    },
    findClickedChildNode(parentNode, localPos) {
        for (let i = 0; i < parentNode.children.length; i++) {
            let childNode = parentNode.children[i];
            if (childNode.getBoundingBoxToWorld().contains(localPos)) {
                return childNode;
            }
        }
        return null;
    },*/
    onMouseDown(event) {
        if (event.getButton() !== cc.Event.EventMouse.BUTTON_LEFT) return;
        this.mousePosition = event.getLocation();
        const object = {
            playerId:0,
            position:this.mousePosition
        }
        Emitter.instance.emit(EVENT_NAME.POSITION,object)
        event.stopPropagation();
    },
});
