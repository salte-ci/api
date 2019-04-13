import { createLogger, transports, format } from 'winston';
import { config } from './config';

const logger = createLogger({
  level: config.LOG_LEVEL,

  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] (${level}): ${message}`;
    })
  ),

  transports: [
    new transports.Console()
  ]
});

logger.silly(JSON.stringify(config, null, '  '));

export { logger };
