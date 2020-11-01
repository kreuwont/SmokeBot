const winston = require('winston');
const path = require('path');

module.exports = (() => {
    const loggerPath = path.join(process.cwd(), './logs');
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: path.join(loggerPath, 'error.log'), level: 'error' }),
            new winston.transports.File({ filename: path.join(loggerPath, 'combined.log') })
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    return logger;
})()