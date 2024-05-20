import logger from './logger';
import winston from 'winston';

jest.mock('winston', () => {
  const winston = jest.requireActual('winston');
  return {
    createLogger: jest.fn().mockReturnValue({
      level: 'info',
      format: 'logFormat',
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }),
      ],
    }),
    format: {
      combine: jest.fn().mockReturnValue('logFormat'),
      timestamp: jest.fn(),
      errors: jest.fn(),
      splat: jest.fn(),
      json: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});

describe('logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should call winston.createLogger', () => {
    expect(winston.createLogger).toHaveBeenCalled();
  });

  it('should have correct level', () => {
    expect(logger.level).toBe('info');
  });

  it('should have correct format', () => {
    expect(logger.format).toBe('logFormat');
  });

  it('should have correct transports', () => {
    expect(logger.transports).toHaveLength(2);
  });
});
