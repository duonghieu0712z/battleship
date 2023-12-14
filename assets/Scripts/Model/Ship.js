const position=require('Position');
const Emitter=require('EventEmitter');
let Ship=cc.Class({
    extends: cc.Component,
    properties: {
     length:0,
     isHorizontal:true,
    },
    ctor(length,isHorizontal) {
       this.length=length;
       this.isHorizontal=isHorizontal;
       this.shipId=this.generateRandomId();
       this.anchorIndex=Math.floor(this.length/2);
       this.positions=[];
       this.creatPos();
    },
    onLoad () {
        if(this.shipId==null){
            this.shipId=this.generateRandomId();
        }
        this.anchorIndex=Math.floor(this.length/2);
        this.positions=[];
        this.creatPos();
    },
    creatPos(){
        for(let i=0;i<this.length;i++){
            this.positions.push(new position(0,0));
        }
    },
    calculatePosition(x,y){
        this.positions[this.anchorIndex].x=x;
        this.positions[this.anchorIndex].y=y;
        if(this.isHorizontal){
            for(let i= this.anchorIndex-1;i>=0;i--){
                this.positions[i].x=x-(this.anchorIndex-i);
                this.positions[i].y=y;
            }
            for(let i= this.anchorIndex+1;i<=this.length-1;i++){
                this.positions[i].x=x+(i-this.anchorIndex);
                this.positions[i].y=y;
            }
        }else{
            for(let i= this.anchorIndex-1;i>=0;i--){
                this.positions[i].x=x;
                this.positions[i].y=y-(this.anchorIndex-i);
            }
            for(let i= this.anchorIndex+1;i<=this.length-1;i++){
                this.positions[i].x=x;
                this.positions[i].y=y+(i-this.anchorIndex);
            }
        }
        Emitter.instance.emit('selected', {positions:this.positions,shipId:this.shipId});
    },
    generateRandomId() {
        return Math.floor(Math.random() * Date.now()).toString();
    },
    playanimOnWater(){
let scaleDown = cc.scaleTo(3, 0.9);
let scaleUp = cc.scaleTo(3, 1);
let sequence = cc.sequence(scaleDown, scaleUp);
let repeatedAction = cc.repeatForever(sequence);
this.node.getChildByName("shipSprite").runAction(repeatedAction);
    },
    changeRotation(){
        this.isHorizontal=!this.isHorizontal;
        if(this.isHorizontal){
            this.node.rotation=0;
        }else{
            this.node.rotation=90;
        }
        cc.log("rotation");
        this.calculatePosition(this.positions[this.anchorIndex].x, this.positions[this.anchorIndex].y);
        Emitter.instance.emit('setShipId', { positions: this.positions, shipId: this.shipId });
    }
});
module.exports=Ship;