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
var StateMachine = require('javascript-state-machine');

cc.Class({
    extends: cc.Component,

    properties: {
        ballCannon: cc.Prefab,
        mapEnemy: cc.Node,
        mapPlayer: cc.Node,
        changeSceneNode: cc.Node,
        pirate: sp.Skeleton,
        clockPlayer: cc.Label,
        clockEnemy: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log(Emitter)
        this.playerId = 0;
        this.enemyId = 1;
        this._shipPlayerCounter = 4
        this._shipEnemyCounter = 4
        Emitter.instance.registerOnce('setEnemyId', (enemyId) => {
            this.enemyId = enemyId;
        })
        Emitter.instance.registerOnce(EVENT_NAME.START, this.setPlayerIdStartGame.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.CHANGE_SCENE, this.changeScene.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.SEND_RESULT, this.playAnimation.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.RESET_TURN, this.restTurn.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.SHIP_FAIL_CHECK, this.changeSceneShipFail.bind(this))
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                {
                    name: 'changePlayerScene',
                    from: ['init', 'enemyScene', 'shipFailScene', 'playerScene'],
                    to: 'playerScene'
                },
                {
                    name: 'changeEnemyScene',
                    from: ['init', 'playerScene', 'shipFailScene', 'enemyScene'],
                    to: 'enemyScene'
                },
                {name: 'changeEndScene', from: ['playerScene', 'enemyScene', 'shipFailScene'], to: 'endScene'},
                {name: 'changeShipFailScene', from: ['playerScene', 'enemyScene'], to: 'shipFailScene'},
            ],
            methods: {
                onChangePlayerScene: this.onChangePlayerScene.bind(this),
                onChangeEnemyScene: this.onChangeEnemyScene.bind(this),
                //onChangeEndScene: this.onChangeEndScene.bind(this),
                onChangeShipFailScene: this.changeSceneShipFail.bind(this)
            }
        });
        //this.fsm.changePlayerScene();
    },
    setPlayerIdStartGame(data) {
        this.playerId = data;
        cc.log(this.playerId);
        this.pirate.node.active = false;
        this.mapPlayer.active = false;
        this.mapEnemy.active = false
        Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY);
        Emitter.instance.registerOnce(EVENT_NAME.WAIT_FOR_ENEMY_DONE, () => {
            this.fsm.changePlayerScene()
        });
    },
    onChangePlayerScene() {
        cc.log("chuyen player");
        this.pirate.node.active = false;
        this.mapEnemy.active = false;
        this.mapPlayer.active = false;
        this.clockEnemy.node.active = false;
        Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL)
        Emitter.instance.registerOnce(EVENT_NAME.YOUR_TURN_PANEL_DONE, () => {
            this.mapEnemy.active = true;
            this.clockPlayer.node.active = true;
            this.pirate.node.active = true;

            Emitter.instance.registerOnce(EVENT_NAME.POSITION, (data) => {
                data.playerId = this.enemyId;
                Emitter.instance.emit('checkTile', data);
                // this.clockPlayer.node.getComponent('ClockController').stopClock();
            })
        })
    },
    onChangeEnemyScene() {
        cc.log("chuyen enemy");
        this.pirate.node.active = false;
        this.mapEnemy.active = false;
        this.mapPlayer.active = false;
        this.clockEnemy.node.active = false;
        this.clockPlayer.node.active = false;
        Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL)
        Emitter.instance.registerOnce(EVENT_NAME.ENEMY_TURN_PANEL_DONE, () => {
            this.mapPlayer.active = true
            this.clockEnemy.node.active = true;
            this.pirate.node.active = true;
            Emitter.instance.registerOnce(EVENT_NAME.POSITION, (data) => {
                data.playerId = this.playerId;
                Emitter.instance.emit(EVENT_NAME.CHECK_POSITION, data)
                cc.log('playerId EnemyScene', data.playerId)
            })
            cc.tween(this.node)
                .call(() => {
                })
                .delay(1.5)
                .call(() => {
                    // this.clockEnemy.node.getComponent('ClockController').stopClock();
                    Emitter.instance.emit(EVENT_NAME.CHOOSE_COORDINATES)
                }).start()
        })
    },
    playAnimation(data) {
        cc.log(data)
        cc.log("goi hàm playAn")
        const currentScene = cc.director.getScene();
        let cannonBall = cc.instantiate(this.ballCannon);
        cannonBall.setParent(currentScene);
        cannonBall.position = cc.v2(450, 100);
        Emitter.instance.emit(EVENT_NAME.SOUND_CANON_SHOOT);
        Emitter.instance.emit("attackToPosition", data)
    },
    restTurn() {
        if (this.fsm.state === 'playerScene') {
            // this.clockPlayer.node.getComponent('ClockController').onEnable();
            this.fsm.changePlayerScene()
        }
        if (this.fsm.state === 'enemyScene') {
            // this.clockEnemy.node.getComponent('ClockController').onEnable();
            this.fsm.changeEnemyScene()
        }
    },
    changeScene(data) {
        cc.log("map quái: " + this.mapEnemy.active)
        if (this.mapEnemy.active === data) {
            cc.log("đổi enemy")
            this.fsm.changeEnemyScene()
        } else {
            cc.log("đổi player")
            this.fsm.changePlayerScene()
        }

    },
    changeSceneShipFail() {
        if (this.fsm.state === 'playerScene') {
            this._shipEnemyCounter--;
            cc.log(this.__shipEnemyCounter)
            if (this._shipEnemyCounter === 0) {
                this.onChangeEndScene("YOUR WINS")
            } else {
                this.fsm.changePlayerScene()
            }
        } else if (this.fsm.state === 'enemyScene') {
            this._shipPlayerCounter--;
            if (this._shipPlayerCounter === 0) {
                this.onChangeEndScene("YOUR LOSE CHICKEN")
            } else {
                this.fsm.changeEnemyScene()
            }
        }
    },
    onChangeEndScene(data) {
        cc.log(data)
    },
});
