/**
 * FoodLine Backend — Production Structured JSON Logger
 * Zero-dependency, lightweight, machine-readable logger with ISO timestamps and log levels.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class StructuredLogger {
  private contextName: string;

  constructor(contextName: string = 'App') {
    this.contextName = contextName;
  }

  public forContext(context: string): StructuredLogger {
    return new StructuredLogger(context);
  }

  private output(level: LogLevel, message: string, data?: Record<string, any>, err?: Error) {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.contextName,
    };

    if (data && Object.keys(data).length > 0) {
      payload.data = data;
    }

    if (err) {
      payload.error = {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      };
    }

    const formatted = JSON.stringify(payload);
    if (level === 'error') {
      console.error(formatted);
    } else if (level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  public debug(message: string, data?: Record<string, any>) {
    if (process.env.DEBUG || process.env.NODE_ENV !== 'production') {
      this.output('debug', message, data);
    }
  }

  public info(message: string, data?: Record<string, any>) {
    this.output('info', message, data);
  }

  public warn(message: string, data?: Record<string, any>, err?: Error) {
    this.output('warn', message, data, err);
  }

  public error(message: string, err?: Error, data?: Record<string, any>) {
    this.output('error', message, data, err);
  }
}

export const logger = new StructuredLogger('FoodLineEngine');
