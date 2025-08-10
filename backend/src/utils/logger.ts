import pino, { LoggerOptions } from 'pino';

export function getLogger(name?: string) {
  const options: LoggerOptions = {
    name: name || 'cliniglobal-backend',
    level: process.env.LOG_LEVEL || 'info',
  };
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore - transport typing differs per pino version
    options.transport = { target: 'pino-pretty' } as any;
  }
  return pino(options as any);
}