import { LogSink } from './logsink';
import { MockLogSink } from './logsink.mock';

export class MockLogSinkService {
  buildPublishers(): void {}

  getLogSink(): LogSink {
    return new MockLogSink();
  }
}
