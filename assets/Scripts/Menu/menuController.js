const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");
cc.Class({
    extends: cc.Component,

    properties: {
        mainMenu: cc.Node,
        mainMenuButton: cc.Node,

        setting: cc.Node,
        helpInfo: cc.Node,

        soundManager: cc.Node,

        musicSlider: cc.Slider,

        soundsSlider: cc.Slider,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        this.mainMenu.active = false;
        this.setting.active = false;
        this.helpInfo.active = false;
        this._soundManager = this.soundManager.getComponent('soundManager');
    },
    update (dt) {
        //this.node.parent.setSiblingIndex(this.node.parent.parent.childrenCount - 1);
    },

    openMainMenu(){
        this.mainMenu.active = true;
        this.mainMenuButton.active = false;
        this.soundButton();
        cc.director.setTimeScale = 0;
    },

    closeMainMenu(){
        this.mainMenu.active = false;
        this.mainMenuButton.active = true;
        this.soundButton();
    },

    openSetting(){
        this.setting.active = true;
        this.soundButton();
    },

    closeSetting(){
        this.setting.active = false;
        this.soundButton();
    },

    openHelpInfo(){
        this.helpInfo.active = true;
        this.soundButton();
    },

    closeHelpInfo(){
        this.helpInfo.active = false;
        this.soundButton();
    },

    soundButton(){
        Emitter.instance.emit(EVENT_NAME.SOUND_CLICK);
    },

    changeMusicVolume(){
        this._soundManager.changeMusicVolume(this.musicSlider.progress);
        // Setting.setMusicVolume(this.musicSlider.progress);
        this.musicSlider.node.getChildByName('Music ProgressBar').getComponent(cc.ProgressBar).progress = this.musicSlider.progress;
    },

    changeSoundsVolume(){
        this._soundManager.changeSoundsVolume(this.soundsSlider.progress);
        this.soundsSlider.node.getChildByName('Sound ProgressBar').getComponent(cc.ProgressBar).progress = this.soundsSlider.progress;
    },
});
