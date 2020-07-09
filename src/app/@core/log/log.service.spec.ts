import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LogOutput, LogService } from './log.service';
import { LogLevel } from './loglevel';
import { LogSinkService } from './sink/logsink.service';
import { MockLogSinkService } from './sink/logsink.service.mock';

const logMethods = ['info', 'debug', 'warn', 'error'];

describe('Logger', () => {
  let savedConsole: any[];
  let savedLevel: LogLevel;
  let savedOutputs: LogOutput[];
  let logService: LogService;

  beforeAll(() => {
    savedConsole = [];
    logMethods.forEach((m) => {
      savedConsole[m] = console[m];
      console[m] = () => {};
    });
    savedLevel = LogService.level;
    savedOutputs = LogService.outputs;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogService, { provide: LogSinkService, useClass: MockLogSinkService }],
    });
    logService = TestBed.inject(LogService);
    LogService.level = LogLevel.Debug;
  });

  afterAll(() => {
    logMethods.forEach((m) => {
      console[m] = savedConsole[m];
    });
    LogService.level = savedLevel;
    LogService.outputs = savedOutputs;
  });

  // it('should create an instance', () => {
  //   expect(new LogService()).toBeTruthy();
  // });

  it('should add a new LogOutput and receives log entries', () => {
    const outputSpy = jasmine.createSpy('outputSpy');

    // Act
    LogService.outputs.push(outputSpy);
    LogService.level = LogLevel.Debug;

    logService.debug('d');
    logService.info('i');
    logService.warn('w');
    logService.error('e', { error: true });

    // Assert
    expect(outputSpy).toHaveBeenCalled();
    expect(outputSpy.calls.count()).toBe(4);
    expect(outputSpy).toHaveBeenCalledWith('d', LogLevel.Debug);
    expect(outputSpy).toHaveBeenCalledWith('i', LogLevel.Information);
    expect(outputSpy).toHaveBeenCalledWith('w', LogLevel.Warning);
    expect(outputSpy).toHaveBeenCalledWith('e', LogLevel.Error, { error: true });
  });

  it('should add a new LogOutput and receives only production log entries', () => {
    const outputSpy = jasmine.createSpy('outputSpy');

    // Act
    LogService.outputs.push(outputSpy);
    LogService.level = LogLevel.Warning;

    logService.debug('d');
    logService.info('i');
    logService.warn('w');
    logService.error('e', { error: true });

    // Assert
    expect(outputSpy).toHaveBeenCalled();
    expect(outputSpy.calls.count()).toBe(2);
    expect(outputSpy).toHaveBeenCalledWith('w', LogLevel.Warning);
    expect(outputSpy).toHaveBeenCalledWith('e', LogLevel.Error, { error: true });
  });
});
