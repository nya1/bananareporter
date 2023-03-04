import winston = require('winston');

export const logger = winston.createLogger({
  level: process.env.BANANAREPORTER_LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
})
