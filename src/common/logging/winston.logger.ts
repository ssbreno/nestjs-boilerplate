import { LoggerService } from '@nestjs/common'
import { createLogger, Logger, LoggerOptions } from 'winston'

export class WinstonLogger implements LoggerService {
  private readonly logger: Logger
  private context?: string

  /**
   *
   * @param options
   */
  constructor(options?: LoggerOptions) {
    this.logger = createLogger(options)
  }

  /**
   *
   * @param context
   */
  public setContext(context: string) {
    this.context = context
  }

  /**
   *
   * @param message
   * @param context
   */
  public log(message: any, context?: string): any {
    context = context || this.context
    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger.info(msg as string, {
        context,
        ...meta,
      })
    }

    return this.logger.info(message, {
      context,
    })
  }

  /**
   *
   * @param message
   * @param trace
   * @param context
   */
  public error(message: any, trace?: string, context?: string): any {
    context = context || this.context
    if (message instanceof Error) {
      const { message: msg, stack } = message

      return this.logger.error(msg, {
        context,
        stack: [trace || stack],
      })
    }

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger.error(msg as string, {
        context,
        stack: [trace],
        ...meta,
      })
    }

    return this.logger.error(message, {
      context,
      stack: [trace],
    })
  }

  /**
   *
   * @param message
   * @param context
   */
  public warn(message: any, context?: string): any {
    context = context || this.context
    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger.warn(msg as string, {
        context,
        ...meta,
      })
    }

    return this.logger.warn(message, {
      context,
    })
  }

  /**
   *
   * @param message
   * @param context
   */
  public debug?(message: any, context?: string): any {
    context = context || this.context
    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger.debug(msg as string, {
        context,
        ...meta,
      })
    }

    return this.logger.debug(message, {
      context,
    })
  }

  /**
   *
   * @param message
   * @param context
   */
  public verbose?(message: any, context?: string): any {
    context = context || this.context

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message

      return this.logger.verbose(msg as string, {
        context,
        ...meta,
      })
    }

    return this.logger.verbose(message, {
      context,
    })
  }
}
