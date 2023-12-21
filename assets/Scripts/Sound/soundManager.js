
const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");
cc.Class({
    extends: cc.Component,

    properties: {
        mainMusic: cc.AudioSource,
        sounds: [cc.AudioSource],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var _canonShoot = this.canonShoot.bind(this);
        var _explosion = this.explosion.bind(this);
        var _shootWater = this.shootWater.bind(this);
        var _click = this.click.bind(this);
        var _loading = this.loading.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_CANON_SHOOT, _canonShoot);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_SHOOT_WATER, _shootWater);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_EXPLOSION, _explosion);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_CLICK, _click);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_LOADING, _loading);
    },

    start () {
        this.mainMusic.play();
    },

    canonShoot(){
        this.playSound('explosion');
    },

    explosion(){
        this.playSound('explosion');
    },

    shootWater(){
        this.playSound('shoot_water');
    },

    click(){
        this.playSound('click');
    },

    loading(data){
        if(data) this.playSound('loading');
        else this.stopSound('loading');
    },

    // update (dt) {},

    playSound(name){
        this.sounds.forEach(element => {
            if(element.node.name == name){
                element.play();
                return;
            }
        });
    },

    stopSound(name){
        this.sounds.forEach(element => {
            if(element.node.name == name){
                element.stop();
                return;
            }
        });
    },
    
    changeMusicVolume(volume){
        this.mainMusic.volume = volume;
    },

    changeSoundsVolume(volume){
        this.sounds.forEach(element => {
            element.volume = volume;
        });
    }
});
