const Emitter = require("EventEmitter")
var StateMachine = require('javascript-state-machine');
const EVENT_NAME = require("NAME_EVENT")
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this._onAttack = this.onAttack.bind(this)
        this._onFinal = this.onFinal.bind(this)
        this._onAttackToAttack = this.onAttackToAttack.bind(this)
        this._onShipFail = this.onShipFail.bind(this)
        Emitter.instance.registerEvent(EVENT_NAME.IS_SHOOT_SHIP, this.handleState.bind(this))
        Emitter.instance.registerEvent(EVENT_NAME.SHIP_FAIL, this.changeStateShipFail.bind(this))
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                {name: 'attack', from: ['init', 'changeState', 'shipFailState'], to: 'attackState'},
                {name: 'final', from: 'attackState', to: 'changeState'},
                {name: 'attackToAttack', from: 'attackState', to: 'attackState'},
                {name: 'shipFail', from: ['attackState', 'changeState'], to: 'shipFailState'},
            ],
            methods: {
                onAttack: this._onAttack,
                onFinal: this._onFinal,
                onAttackToAttack: this._onAttackToAttack,
                onShipFail: this._onShipFail,
            }
        });
        this.fsm.attack();
    },
    onAttack() {
        let talkString = this.node.children[0].children[0].getComponent(cc.Label);
        talkString.string = "SHOOTING SHIP ENEMY"
    },
    onFinal() {
        let talkString = this.node.children[0].children[0].getComponent(cc.Label);
        let arrayTalking = {CB: "CHICKEN BOYS", YT: "YOURS TURN HAS FINISHED"}
        cc.tween(talkString.node)
            .call(() => {
                talkString.string = arrayTalking.CB
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.YT
            })
            .delay(1)
            .call(() => {
                Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE, true)
                this.fsm.attack();
            })
            .start()
    },
    onAttackToAttack() {
        let talkString = this.node.children[0].children[0].getComponent(cc.Label);
        let arrayTalking = {GB: "GOOD BOYS", HASHIT: "U HAS HIT ENEMY SHIP", SA: "SHOOT AGAIN"};
        cc.tween(talkString.node)
            .call(() => {
                talkString.string = arrayTalking.GB
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.HASHIT
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.SA
                Emitter.instance.emit(EVENT_NAME.RESET_TURN)
            })
            .start()
    },
    onShipFail() {
        cc.log("pirate taking")
        let talkString = this.node.children[0].children[0].getComponent(cc.Label);
        let arrayTalking = {GB: "GOOD BOYS", SB: "ENEMY SHIP HAS FAILED", GJ: "GOOD JOBS", SA: "SHOOT AGAIN"};
        cc.tween(talkString.node)
            .call(() => {
                talkString.string = arrayTalking.GB
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.SB
            }).delay(1)
            .call(() => {
                talkString.string = arrayTalking.GJ
            })
            .delay(1)
            .call(() => {
                talkString.string = arrayTalking.SA
                Emitter.instance.emit(EVENT_NAME.RESET_TURN)
                this.fsm.attack();
            })
            .start()
    },
    changeStateShipFail(){
        this.fsm.shipFail();
    },
    handleState(data) {
        cc.log("pre" + data)
        if (data) {
            this.fsm.attackToAttack();
        } else {
            cc.log("hello")
            this.fsm.final();
        }
    },
    update() {
        cc.log(this.fsm.state)
    }
});
