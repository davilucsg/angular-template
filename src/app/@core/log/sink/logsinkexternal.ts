import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogEntry } from '../logentry';
import { LogSink } from './logsink';

export class LogWebApi extends LogSink {
  constructor(private http: HttpClient) {
    // Must call super() from derived classes
    super();
    // Set location
    this.location = '/api/log';
  }

  // Add log entry to back end data store
  log(entry: LogEntry): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(this.location, entry, { headers });
  }
}
