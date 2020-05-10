import type { HttpError } from 'http-errors'

export enum LogLevel {
  fatal = 0,
  error = 1,
  warn = 2,
  info = 3,
  debug = 4
}

export type LogMessage = string | Error | HttpError

export interface LogPayload {
  [propName: string]: any
}

export interface FormattedLog {
  expose?: boolean
  headers?: {
    [propName: string]: any
  }
  level: LogLevel
  message: string
  stack?: string
  statusCode?: number
  timestamp: Date
  [propName: string]: any
}

export type FormatterFn = (log: FormattedLog) => any

export interface LogTransport {
  dispatch: (log: FormattedLog) => void
  [propName: string]: any
}
