const Emitter = require("EventEmitter");
const EVENT_NAME = require("NAME_EVENT");

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
        this.enemyId = Math.floor(Math.random() * Date.now()).toString();

        const onChooseCoordinates = this.chooseCoordinates.bind(this);
        Emitter.instance.registerEvent(
            EVENT_NAME.CHOOSE_COORDINATES,
            onChooseCoordinates,
        );

        const onCompleteHitShip = this.onCompleteHitShip.bind(this);
        Emitter.instance.registerEvent(
            EVENT_NAME.COMPLETE_HIT_SHIP,
            onCompleteHitShip,
        );

        const onHitShip = this.onHitShip.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.HIT_SHIP, onHitShip);

        Emitter.instance.registerEvent(
            "receiveresult",
            this.responeResult.bind(this),
        );
    },

    start() {
        Emitter.instance.emit("setEnemyId", this.enemyId);
    },

    chooseCoordinates() {
        let position = null;
        cc.log("enemy called");
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
        cc.log("enemy position: ", position);
        this._saveHitPos.push(position);

        Emitter.instance.emit(EVENT_NAME.POSITION, {
            position: {
                // playerId: this.enemyId,
                x: position.column,
                y: position.row,
            },
        });
    },

    hasHitShip(position) {
        return this._saveHitPos.some(
            (value) =>
                value.row === position.row && value.column === position.column,
        );
    },

    onHitShip(position) {
        this._isHitting = true;
        this._hitPos.push(position);
    },

    onCompleteHitShip() {
        this._isHitting = false;
        this._hitPos = [];
    },

    responeResult(data) {
        if (this.enemyId == data.playerId) {
            if (data.shipId == null) {
                cc.log("hut");
                Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                    isHit: false,
                    worldPosition: data.worldPosition,
                });
            } else {
                const out = {};
                Emitter.instance.emit("updateLength", data.shipId, out);
                const { length } = out;
                if (length == 0) {
                    cc.log("no");
                    Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                        isHit: true,
                        worldPosition: data.worldPosition,
                        shipLength: length,
                    });
                } else {
                    cc.log("trung");
                    Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
                        isHit: true,
                        worldPosition: data.worldPosition,
                        shipLength: length,
                    });
                }
            }
        }
    },
});
