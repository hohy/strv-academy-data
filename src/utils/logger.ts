
import pino from 'pino'

export const loggerInstance = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    }
  },
})

export const logger = loggerInstance
