import { LogEntry } from '../logentry';
import { LogSink } from './logsink';

export class MockLogSink extends LogSink {
  log(entry: LogEntry): void {}
}