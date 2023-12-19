const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");
cc.Class({
    extends: cc.Component,

    properties: {
        yourTurnPanel: cc.Node,
        xStartYourTurn: -1050,

        enemyTurnPanel: cc.Node,
        xStartEnemyTurn: 1050,

        circleLoading: cc.Node,

        loadingLabel: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.circleLoading.parent.active = false;
        var _yourTurn = this.yourTurn.bind(this);
        var _enemyTurn = this.enemyTurn.bind(this);
        var _waitForEnemy = this.waitForEnemy.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.YOUR_TURN_PANEL, _yourTurn);
        Emitter.instance.registerEvent(EVENT_NAME.ENEMY_TURN_PANEL, _enemyTurn);
        Emitter.instance.registerEvent(EVENT_NAME.WAIT_FOR_ENEMY, _waitForEnemy);
    },

    start () {
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
                Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL_DONE);
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
                Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL_DONE);
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
                    this.loadingLabel.string = 'WAITING ENEMY';
                })
            ),
            cc.spawn(
                cc.delayTime(1),
                cc.callFunc(()=>{
                    this.loadingLabel.string = 'START';
                })
            ),
            cc.callFunc(()=>{
                this.circleLoading.rotation = 0;
                this.circleLoading.parent.active = false;
                Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY_DONE)
            })
        )
        this.circleLoading.runAction(action);
    }
});
