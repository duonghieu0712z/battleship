const Emitter = require("EventEmitter");

const { randomPosition, randomAroundPositions } = require("rands");

cc.Class({
    extends: cc.Component,

    properties: {
        _isHitting: false,
        _hitPos: [],
        _saveHitPos: [],

        _maxRow: 8,
        _maxColumn: 8,
    },

    onLoad() {
        const onCompleteHitShip = this.onCompleteHitShip.bind(this);
        const onHitShip = this.onHitShip.bind(this);

        Emitter.instance.registerEvent("complete-hit-ship", onCompleteHitShip);
        Emitter.instance.registerEvent("hit-ship", onHitShip);
    },

    chooseCoordinates() {
        let position = null;
        do {
            if (!this._isHitting) {
                position = randomPosition(this._maxRow, this._maxColumn);
            } else {
                position = randomAroundPositions(
                    this._hitPos,
                    this._maxRow,
                    this._maxColumn,
                );
            }
        } while (this.hasHitShip(position));
        this._saveHitPos.push(position);

        // Emitter.instance.emit("position", position);
    },

    hasHitShip(position) {
        return this._saveHitPos.includes(position);
    },

    onHitShip(position) {
        this._isHitting = true;
        this._hitPos.push(position);
    },

    onCompleteHitShip() {
        this._isHitting = false;
        this._hitPos = [];
    },
});
