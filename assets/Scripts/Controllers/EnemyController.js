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

        Emitter.instance.registerEvent("hit-ship", onCompleteHitShip);
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
                    this._maxColumn
                );
            }
        } while (this.hasHitShip(position));
        this.hitShip(position);

        // Emitter.instance.emit("position", position);
    },

    hasHitShip(position) {
        return this._saveHitPos.includes(position);
    },

    hitShip(position) {
        this._isHitting = true;
        this._hitPos.push(position);
        this._saveHitPos.push(position);
    },

    onCompleteHitShip() {
        this._isHitting = false;
        this._hitPos = [];
    },
});
