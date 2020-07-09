import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LogSink } from './logsink';
import { LogConsole } from './logsinkconsole';
import { LogWebApi } from './logsinkexternal';
import { LogSinkType } from './logsinktype';

@Injectable({
  providedIn: 'root',
})
export class LogSinkService {
  private logSink: LogSink;

  constructor(private httpClient: HttpClient) {
    this.buildPublishers();
  }

  buildPublishers(): void {
    let logSink: LogSink;

    switch (environment.log.logSink) {
      case LogSinkType.External:
        logSink = new LogWebApi(this.httpClient);
        break;

      case LogSinkType.Console:
      default:
        logSink = new LogConsole();
        break;
    }
    this.logSink = logSink;
  }

  getLogSink(): LogSink {
    return this.logSink;
  }
}
