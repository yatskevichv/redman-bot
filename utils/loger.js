var winston = require('winston');
let filename;
let log = null;

module.exports = function(module) {
    filename = module.filename;
    return makeLogger();
}

const { splat, combine, timestamp, printf } = winston.format;

// meta param is ensured by splat()
const myFormat = printf(({ timestamp, level, message, meta }) => {
    return `${timestamp}; ${filename};  ${level};   ${message};  ${meta? JSON.stringify(meta) : ''}`;
});

function makeLogger() {

    if (log)
        return log;

    var transports = [
        new winston.transports.Console({
            colorize: true,
            level: 'info'
        }),
        new winston.transports.File({ filename: 'debug.log', level: 'debug' })
    ];

    log = winston.createLogger({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            myFormat,
        ),
        transports: transports
    });

    return log
}