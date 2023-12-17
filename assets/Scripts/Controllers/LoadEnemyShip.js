const Ship = require("Ship");

const { randomPosition } = require("rands");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        shipPool: [Ship],
    },

    onLoad() {
        this.shipPool.push(new Ship(4));
        this.shipPool.push(new Ship(3));
        this.shipPool.push(new Ship(2));
        this.shipPool.push(new Ship(1));

        // const onRandomShips = this.onRandomShips.bind(this);
        // Emitter.instance.registerOnce("random-enemy-ship", onRandomShips);

        Emitter.instance.registerEvent(
            "updateLength",
            this.updateLength.bind(this),
        );
    },

    start() {
        this.onRandomShips();
        Emitter.instance.emit("log-enemy-map");
    },

    onRandomShips() {
        this.shipPool.forEach((ship) => {
            this.onRandomShip(ship);
        });
    },

    onRandomShip(ship) {
        ship.isHorizontal = Math.random() < 0.5;

        const data = { isSuccess: false };
        do {
            const pos = randomPosition(8, 8);
            ship.calculatePosition(pos.column, pos.row, false);

            data.arrayPos = ship.positions;
            data.shipId = ship.shipId;
            Emitter.instance.emit("set-enemy-ship-pos", data);
        } while (!data.isSuccess);
    },

    getShipById(shipId) {
        for (let index = 0; index < this.shipPool.length; index++) {
            if (this.shipPool[index].shipId == shipId) {
                return this.shipPool[index];
            }
        }
    },

    updateLength(shipId, out) {
        let ship = this.getShipById(shipId);
        ship.length -= 1;
        out.length = ship.length;
    },
});
