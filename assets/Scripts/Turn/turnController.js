const Emitter = require("EventEmitter");
cc.Class({
    extends: cc.Component,

    properties: {
        yourTurnPanel: cc.Node,
        xStartYourTurn: -850,

        enemyTurnPanel: cc.Node,
        xStartEnemyTurn: 850,

        circleLoading: cc.Node,

        loadingLabel: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.circleLoading.parent.active = false;
        var _yourTurn = this.yourTurn.bind(this);
        var _enemyTurn = this.enemyTurn.bind(this);
        var _waitForEnemy = this.waitForEnemy.bind(this);
        Emitter.instance.registerEvent("UI-yourTurn", _yourTurn);
        Emitter.instance.registerEvent("UI-enemyTurn", _enemyTurn);
        Emitter.instance.registerEvent("UI-waitForEnemy", _waitForEnemy);
        this.resetPosition();
    },

    // update (dt) {},

    resetPosition(){
        this.yourTurnPanel.x = this.xStartYourTurn;
        this.enemyTurnPanel.x = this.xStartEnemyTurn;
    },

    yourTurn(){
        var action = cc.sequence(
            cc.moveTo(0.5, -20, 0),
            cc.moveTo(1, 20 , 0),
            cc.moveTo(0.5, 850, 0),
            cc.callFunc(()=>{
                this.resetPosition();
            })
        )
        this.yourTurnPanel.runAction(action);
    },

    enemyTurn(){
        var action = cc.sequence(
            cc.moveTo(0.5, 20, 0),
            cc.moveTo(1, -20 , 0),
            cc.moveTo(0.5, -850, 0),
            cc.callFunc(()=>{
                this.resetPosition();
            })
        )
        this.enemyTurnPanel.runAction(action);
    },

    waitForEnemy(){
        this.circleLoading.parent.active = true;
        var action = cc.sequence(
            cc.spawn(
                cc.rotateTo(3, 180),
                cc.callFunc(()=>{
                    this.loadingLabel.string = 'Waiting Enemy';
                })
            ),
            cc.spawn(
                cc.delayTime(1),
                cc.callFunc(()=>{
                    this.loadingLabel.string = 'Start';
                })
            ),
            cc.callFunc(()=>{
                this.circleLoading.rotation = 0;
                this.circleLoading.parent.active = false;
            })
        )
        this.circleLoading.runAction(action);
    }
});
