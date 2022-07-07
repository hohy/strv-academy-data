
import pino from 'pino'

export const loggerInstance = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty'
  },
})

export const logger = loggerInstance
