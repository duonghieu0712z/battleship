const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

cc.Class({
    extends: cc.Component,

    properties: {
        yourTurnPanel: cc.Node,
        xStartYourTurn: -1500,

        enemyTurnPanel: cc.Node,
        xStartEnemyTurn: 1500,

        circleLoading: cc.Node,

        loadingLabel: cc.Label,

        mapHead: cc.Node,

        miniMapHead: cc.Node,

    },

    onLoad() {
        this.circleLoading.parent.active = false;
        var _yourTurn = this.yourTurn.bind(this);
        var _enemyTurn = this.enemyTurn.bind(this);
        var _waitForEnemy = this.waitForEnemy.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.YOUR_TURN_PANEL, _yourTurn);
        Emitter.instance.registerEvent(EVENT_NAME.ENEMY_TURN_PANEL, _enemyTurn);
        Emitter.instance.registerEvent(
            EVENT_NAME.WAIT_FOR_ENEMY,
            _waitForEnemy
        );
        this.mapHeadLabel = this.mapHead.getChildByName('Label').getComponent(cc.Label);
        this.miniMapHeadLabel = this.miniMapHead.getChildByName('Label').getComponent(cc.Label);

        this.mapHeadBackground = this.mapHead.getChildByName('Background');
        this.miniMapHeadBackground = this.miniMapHead.getChildByName('Background');
    },

    start() {
        this.resetPosition();
        this.mapHead.active = false;
        this.miniMapHead.active = false;
    },

    resetPosition() {
        this.yourTurnPanel.x = this.xStartYourTurn;
        this.enemyTurnPanel.x = this.xStartEnemyTurn;

        this.yourTurnPanel.active = false;
        this.enemyTurnPanel.active = false;
    },

    yourTurn() {
        this.mapHead.active = false;
        this.miniMapHead.active = false;
        this.yourTurnPanel.active = true;
        var action = cc.sequence(
            cc.moveTo(0.5, -20, 0),
            cc.moveTo(1, 20, 0),
            cc.moveTo(0.5, 1500, 0),
            cc.callFunc(() => {
                this.resetPosition();
                Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL_DONE);
                this.mapHead.active = true;
                this.miniMapHead.active = true;
                this.mapHeadLabel.string = 'YOUR TURN';
                this.miniMapHeadLabel.string = 'YOUR TURN';

                this.mapHeadBackground.color = new cc.Color(0,0,255);
                this.miniMapHeadBackground.color = new cc.Color(0,0,255);
            })
        );
        this.yourTurnPanel.runAction(action);
    },

    enemyTurn() {
        this.enemyTurnPanel.active = true;
        this.mapHead.active = false;
        this.miniMapHead.active = false;
        var action = cc.sequence(
            cc.moveTo(0.5, 20, 0),
            cc.moveTo(1, -20, 0),
            cc.moveTo(0.5, -1500, 0),
            cc.callFunc(() => {
                this.resetPosition();
                Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL_DONE);
                this.mapHead.active = true;
                this.miniMapHead.active = true;

                this.mapHeadLabel.string = `ENEMY'S TURN`;
                this.miniMapHeadLabel.string = `ENEMY'S TURN`;
                this.mapHeadBackground.color = new cc.Color(146,123,48);
                this.miniMapHeadBackground.color = new cc.Color(146,123,48);
            })
        );
        this.enemyTurnPanel.runAction(action);
    },

    waitForEnemy() {
        this.mapHead.active = false;
        this.miniMapHead.active = false;
        this.circleLoading.parent.active = true;
        var action = cc.sequence(
            cc.spawn(
                cc.rotateTo(3, 180),
                cc.callFunc(() => {
                    this.loadingLabel.string = "WAITING ENEMY";
                    Emitter.instance.emit(EVENT_NAME.SOUND_LOADING);
                })
            ),
            cc.spawn(
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.loadingLabel.string = "START";
                })
            ),
            cc.callFunc(() => {
                this.circleLoading.rotation = 0;
                this.circleLoading.parent.active = false;

                Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY_DONE);
            })
        );
        this.circleLoading.runAction(action);
    },
});
