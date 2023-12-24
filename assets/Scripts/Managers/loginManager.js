var percent = {
    value: 0,
};

cc.Class({
    extends: cc.Component,

    properties: {
        loginScene: cc.Node,
        loadingScene: cc.Node,
        loadingWaves: cc.Node,

        loginMusic: cc.AudioSource,

        yStart: 40,

        yEnd: 280,

        percentLabel: cc.Label,
    },

    onLoad() {},

    start() {
        this.loginScene.active = true;
        this.loadingScene.active = false;
        this.loginMusic.volume = cc.sys.localStorage.getItem("mainMusicVolume");
    },

    update(dt) {

    },

    setPercentLabel(percent) {
        this.percentLabel.string = percent + `%`;
    },

    loading() {
        this.loginScene.active = false;
        this.loadingScene.active = true;
        this.loadGameAssets();
    },

    loadGameAssets() {
        cc.tween(this.loadingWaves).to(2, { y: this.yEnd - 20 }).start();
        cc.director.preloadScene("mainScene", (completedCount, totalCount, item) => {
            var progress = (completedCount / totalCount)*100;
            this.percentLabel.string = progress.toFixed()+`%`;
        }, (error) => {
            if (!error) {
                cc.director.loadScene("mainScene");
            } else {
                console.error(error);
            }
        });
    },
});
