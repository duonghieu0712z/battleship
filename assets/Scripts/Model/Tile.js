cc.Class({
    extends: cc.Component,

    properties: {
        cover:cc.Node,
        activeColor:cc.Color,
        effect:[cc.Prefab],
        shipId:null
    },
    onLoad(){

    },
    start () {

    },
    active(isSelected){
        if(isSelected){
            this.cover.active=true;
            this.cover.color=this.activeColor
        }else{
            this.cover.active=false;
        }
    },
    select(){
        let effect=null;
        if(this.isHasShip){
           effect=cc.instantiate(this.effect[0]);
        }else{
            effect=cc.instantiate(this.effect[1]);
        }
        effect.parent=this.node;
    }
});
