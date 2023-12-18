const { randomPosition } = require("rands");
const Emitter = require("EventEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        shipPool: [cc.Prefab],
    },

    onLoad() {
        // this.shipPool.push(new Ship(4));
        // this.shipPool.push(new Ship(3));
        // this.shipPool.push(new Ship(2));
        // this.shipPool.push(new Ship(1));
        // const onRandomShips = this.onRandomShips.bind(this);
        // Emitter.instance.registerOnce("random-enemy-ship", onRandomShips);
    },

    start() {
        this.onRandomShips();
        Emitter.instance.emit("log-enemy-map");
    },

    onRandomShips() {
        this.shipPool.forEach((prefab) => {
            const node = cc.instantiate(prefab);
            node.parent = this.node;
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

            data.arrayPos = ship.positions;
            data.shipId = ship.shipId;
            Emitter.instance.emit("set-enemy-ship-pos", data);
        } while (!data.isSuccess);
    },
});
