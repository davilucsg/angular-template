/**
 * Simple logger system with the possibility of registering custom outputs.
 *
 * 4 different log levels are provided, with corresponding methods:
 * - debug   : for debug information
 * - info    : for informative status of the application (success, ...)
 * - warning : for non-critical errors that do not prevent normal application behavior
 * - error   : for critical errors that prevent normal application behavior
 *
 * Example usage:
 * ```
 * import { LogService } from 'app/core/logger.service';
 *
 * constructor( private logService: LogService)
 * ...
 * logService.debug('something happened');
 * ```
 *
 * To disable debug and info logs in production, add this snippet to your root component:
 * ```
 * export class AppComponent implements OnInit {
 *   ngOnInit() {
 *     if (environment.production) {
 *       LogService.enableProductionMode();
 *     }
 *     ...
 *   }
 * }
 *
 * If you want to process logs through other outputs than console, you can add LogOutput functions to Logger.outputs.
 */

import { Injectable } from '@angular/core';
import { LogEntry } from './logentry';
import { LogLevel } from './loglevel';
import { LogSink } from './sink/logsink';
import { LogSinkService } from './sink/logsink.service';

export type LogOutput = (msg: string | undefined, level: LogLevel, ...objects: any[]) => void;

@Injectable({
  providedIn: 'root',
})
export class LogService {
  static level = LogLevel.Verbose;
  /**
   * Additional log outputs for testing purpose.
   */
  static outputs: LogOutput[] = [];

  sink: LogSink;

  static enableProductionMode() {
    LogService.level = LogLevel.Error;
  }

  constructor(publisherServices: LogSinkService) {
    this.sink = publisherServices.getLogSink();
  }

  debug(msg: string, ...objects: any[]) {
    this.writeToLog(msg, LogLevel.Debug, objects);
  }

  info(msg: string, ...objects: any[]) {
    this.writeToLog(msg, LogLevel.Information, objects);
  }

  warn(msg: string, ...objects: any[]) {
    this.writeToLog(msg, LogLevel.Warning, objects);
  }

  error(msg: string, ...objects: any[]) {
    this.writeToLog(msg, LogLevel.Error, objects);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      const entry: LogEntry = new LogEntry();
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;

      LogService.outputs.forEach((output) => output.apply(output, [msg, level, ...params]));
      this.sink.log(entry);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= LogService.level;
  }
}
