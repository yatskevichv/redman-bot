const mongoose = require("mongoose");
const EventEmitter = require("events");
let log = require('../../utils/loger')(module);


class Mongo extends EventEmitter {
    constructor() {
        super();
    }

    async start() {
        try {
            await mongoose.connect();
        } catch (e) {
            log.error(e);
        }
    }
}


module.exports = Mongo;