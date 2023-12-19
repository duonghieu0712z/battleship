const { randomPosition } = require("rands");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        shipPrefabs: [cc.Prefab],
        pool: cc.Node,
    },

    onLoad() {
        // const onRandomShips = this.onRandomShips.bind(this);
        // Emitter.instance.registerOnce("random-enemy-ship", onRandomShips);
    },

    start() {
        this.onRandomShips();
        Emitter.instance.emit("log-enemy-map");
    },

    onRandomShips() {
        this.shipPrefabs.forEach((prefab) => {
            const node = cc.instantiate(prefab);
            node.parent = this.pool;
            node.active = false;

            const ship = node.getComponent("Ship");
            this.onRandomShip(ship);
        });
    },

    onRandomShip(ship) {
        ship.isHorizontal = Math.random() < 0.5;

        const data = { isSuccess: false };
        do {
            const pos = randomPosition(8, 8);
            ship.calculatePosition(pos.column, pos.row, false);

            data.ship = ship;
            data.arrayPos = ship.positions;
            data.shipId = ship.shipId;
            Emitter.instance.emit("set-enemy-ship-pos", data);
        } while (!data.isSuccess);
    },
});
