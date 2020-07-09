import { LogEntry } from '../logentry';

export abstract class LogSink {
  location: string;
  abstract log(record: LogEntry): void;
}
