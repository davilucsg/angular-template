import { LogEntry } from '../logentry';
import { LogSink } from './logsink';

export class LogConsole extends LogSink {
  constructor() {
    super();
    this.location = 'Console';
  }

  log(entry: LogEntry): void {
    // Log to console
    console.log(entry.buildLogString());
  }
}
