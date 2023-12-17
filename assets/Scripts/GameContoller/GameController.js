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
        piravte:sp.Skeleton
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log(Emitter)
        this.playerId = 0;
        this.enemyId = 1;
        Emitter.instance.registerOnce(EVENT_NAME.START,this.setPlayerIdStartGame.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.CHANGE_SCENE, this.changeScene.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.SEND_RESULT, this.playAnimation.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.RESET_TURN, this.restTurn.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.SHIP_FAIL, this.changeSceneShipFail.bind(this))
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                {name: 'changePlayerScene', from: ['init', 'enemyScene','shipFailScene'], to: 'playerScene'},
                {name: 'changeEnemyScene', from: ['init', 'playerScene','shipFailScene'], to: 'enemyScene'},
                {name: 'changeEndScene', from: ['playerScene', 'enemyScene','shipFailScene'], to: 'endScene'},
                {name: 'changeShipFailScene', from: ['playerScene', 'enemyScene'], to: 'shipFailScene'},
            ],
            methods: {
                onChangePlayerScene: this.onChangePlayerScene.bind(this),
                onChangeEnemyScene: this.onChangeEnemyScene.bind(this),
                //onChangeEndScene: this.onChangeEndScene.bind(this),
                onEnterEnemyScene: this.onEnterEnemyScene.bind(this),
                onEnterPlayerScene: this.onEnterPlayerScene.bind(this),
                OnChangeShipFailScene: this.changeSceneShipFail.bind(this)
            }
        });
        //this.fsm.changePlayerScene();
    },
    setPlayerIdStartGame(data){
        this.playerId = data;
        cc.log(this.playerId);
        this.piravte.node.active= true;
        this.fsm.changeEnemyScene();
        cc.tween(this.node)
            .delay(5)
            .call(()=>{
                const object = {
                    playerId:0,
                    position:{x:0,y:0}
                }
                cc.log('twwen');
                Emitter.instance.emit(EVENT_NAME.POSITION,object)
            }).start()
    },
    onChangePlayerScene() {
        cc.log("chuyen player");
        this.mapPlayer.active = false;
        this.mapEnemy.active = true

    },
    onChangeEnemyScene() {
        cc.log("chuyen enemy");
        this.mapPlayer.active = true;
        this.mapEnemy.active = false;
    },
    onEnterEnemyScene() {
        cc.log("hello enemy");
        //bug
        Emitter.instance.registerOnce(EVENT_NAME.POSITION, (data) => {
            cc.log(data)
            data.playerId = this.playerId;
            Emitter.instance.emit(EVENT_NAME.STOP_CLOCK)
            Emitter.instance.emit(EVENT_NAME.CHECK_POSITION, data)
        })
        Emitter.instance.emit(EVENT_NAME.COLD_DOWN_CLOCK)
    },
    onEnterPlayerScene() {
        cc.log("hello player ");
        //bug
        Emitter.instance.registerOnce(EVENT_NAME.POSITION, (data) => {
            data.playerId = this.enemyId;
            Emitter.instance.emit(EVENT_NAME.STOP_CLOCK)
            Emitter.instance.emit(EVENT_NAME.CHECK_POSITION, data)
        })
        Emitter.instance.emit(EVENT_NAME.COLD_DOWN_CLOCK)
    },
    playAnimation(data) {
        cc.log('send result: ' + data)
        const currentScene = cc.director.getScene();
        let cannonBall = cc.instantiate(this.ballCannon);
        cannonBall.setParent(currentScene);
        cannonBall.position = cc.v2(450, 100);
        Emitter.instance.emit("attackToPosition", data)
    },
    restTurn() {
        if(this.fsm.state ==='playerScene')this.onEnterPlayerScene()
        if(this.fsm.state ==='enemyScene')this.onEnterEnemyScene()
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
    changeSceneShipFail(){
        cc.log('ship fail')
    }
});
