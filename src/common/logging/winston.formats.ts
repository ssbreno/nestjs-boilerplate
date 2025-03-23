import * as clc from 'cli-color'
import { format } from 'winston'
import * as winston from 'winston'

interface LogLevel {
  [key: string]: number
}

interface FormatOptions {
  upperCase?: boolean
}

interface WinstonInfo extends winston.Logform.TransformableInfo {
  level: string
  levels?: LogLevel
  context?: string
  timestamp?: string | number | Date
  message: unknown
  ms?: string
  [key: string]: unknown
}

// Using enum-like object for mapping level codes to names
type LogLevelCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
type StackDriverLevel = Record<LogLevelCode, string>

// Map of npm output levels to Stackdriver Logging levels.
const NPM_LEVEL_NAME_TO_CODE: LogLevel = {
  error: 3,
  warn: 4,
  info: 6,
  verbose: 7,
  debug: 7,
  silly: 7,
}

// Map of Stackdriver Logging levels.
// eslint-disable-next-line @typescript-eslint/naming-convention
const STACK_DRIVER_LOGGING_LEVEL_CODE_TO_NAME: StackDriverLevel = {
  0: 'emergency',
  1: 'alert',
  2: 'critical',
  3: 'error',
  4: 'warning',
  5: 'notice',
  6: 'info',
  7: 'debug',
}

const NEST_COLOR_SCHEME: Record<string, (text: string) => string> = {
  info: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magenta,
  verbose: clc.cyan,
}

interface FormatOptions {
  upperCase?: boolean
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @param value The value to check.
 * @returns Returns `true` if `value` is an object, else `false`.
 */
function isObject(value: unknown): value is object {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
export const severity = format((info: WinstonInfo): WinstonInfo => {
  const { level } = info
  const levels = info.levels || NPM_LEVEL_NAME_TO_CODE
  const levelCode = levels[level] || 6 // Default to info
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const stackDriverLevel =
    STACK_DRIVER_LOGGING_LEVEL_CODE_TO_NAME[levelCode as LogLevelCode] || 'info'

  return {
    ...info,
    severity: stackDriverLevel.toUpperCase(),
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
export const severityWithOptions = (options: FormatOptions = {}): any =>
  format((info: WinstonInfo): WinstonInfo => {
    const { level } = info
    const levels = info.levels || NPM_LEVEL_NAME_TO_CODE
    const levelCode = levels[level] || 6 // Default to info
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const stackDriverLevel =
      STACK_DRIVER_LOGGING_LEVEL_CODE_TO_NAME[levelCode as LogLevelCode] || 'info'

    return {
      ...info,
      severity: options.upperCase ? stackDriverLevel.toUpperCase() : stackDriverLevel,
    }
  })

// Make sure this returns a proper Winston Format
export const nestConsoleFormat = (appName = 'NestWinston'): winston.Logform.Format => {
  // The format function returns FormatWrap but we need Format
  // We need to cast it to the expected type
  return format((info: WinstonInfo) => {
    const { context, level, timestamp, message, ms, ...meta } = info
    const color = NEST_COLOR_SCHEME[level] || ((text: string): string => text)
    const levelMessage = color(`[${appName}] ${level.toUpperCase()} - `)

    const timestampMessage = timestamp
      ? new Date(timestamp).toLocaleString()
      : new Date().toLocaleString()

    const contextMessage = context ? clc.yellow(`[${context}] `) : ''

    const outputMessage = isObject(message)
      ? color(JSON.stringify(message))
      : color(String(message))

    const timestampDiff = ms ? clc.yellow(ms) : ''

    const metaMessage = Object.keys(meta).length > 0 ? color(JSON.stringify(meta, null, 2)) : ''

    const formattedMessage =
      `${levelMessage}${timestampMessage} ${contextMessage}${outputMessage}${timestampDiff ? ' ' + timestampDiff : ''}${metaMessage ? ' ' + metaMessage : ''}`.trim()

    info.message = formattedMessage

    return info
  })() as winston.Logform.Format // Add a function call and cast the result to the expected type
}
