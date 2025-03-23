import { ConfigService } from '@nestjs/config'

describe('Environment Constants', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  // Legacy constants tests
  describe('LOG_LEVEL', () => {
    it('should use default value when LOG_LEVEL is not set', () => {
      delete process.env.LOG_LEVEL
      const { LOG_LEVEL } = require('../../../src/common/constants/env')
      expect(LOG_LEVEL).toBe('debug')
    })

    it('should use environment value when LOG_LEVEL is set', () => {
      process.env.LOG_LEVEL = 'info'
      const { LOG_LEVEL } = require('../../../src/common/constants/env')
      expect(LOG_LEVEL).toBe('info')
    })
  })

  describe('IS_PRODUCTION', () => {
    it('should be false when NODE_ENV is not production', () => {
      process.env.NODE_ENV = 'development'
      const { IS_PRODUCTION } = require('../../../src/common/constants/env')
      expect(IS_PRODUCTION).toBe(false)
    })

    it('should be true when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production'
      const { IS_PRODUCTION } = require('../../../src/common/constants/env')
      expect(IS_PRODUCTION).toBe(true)
    })
  })

  describe('PORT', () => {
    it('should use default value when PORT is not set', () => {
      delete process.env.PORT
      const { PORT } = require('../../../src/common/constants/env')
      expect(PORT).toBe(8080)
    })

    it('should use environment value when PORT is set', () => {
      process.env.PORT = '4000'
      const { PORT } = require('../../../src/common/constants/env')
      expect(PORT).toBe('4000')
    })
  })

  // ConfigService integration tests
  describe('ConfigService Integration', () => {
    let envModule: any
    let mockConfigService: { get: jest.Mock }

    beforeEach(() => {
      mockConfigService = {
        get: jest.fn(),
      }

      jest.resetModules()
      envModule = require('../../../src/common/constants/env')
    })

    describe('setConfigService', () => {
      it('should set the config service instance', () => {
        envModule.setConfigService(mockConfigService)

        // Verify the config service was set by calling one of the accessor methods
        mockConfigService.get.mockReturnValueOnce('test-log-level')
        const result = envModule.getLogLevel()

        expect(mockConfigService.get).toHaveBeenCalledWith('app.logLevel')
        expect(result).toBe('test-log-level')
      })
    })

    describe('getLogLevel', () => {
      it('should get log level from config service when available', () => {
        envModule.setConfigService(mockConfigService)
        mockConfigService.get.mockReturnValueOnce('info')

        const result = envModule.getLogLevel()

        expect(mockConfigService.get).toHaveBeenCalledWith('app.logLevel')
        expect(result).toBe('info')
      })

      it('should fall back to process.env when config service not set', () => {
        // Create a new module instance without setting config service
        delete process.env.LOG_LEVEL
        jest.resetModules()
        const freshModule = require('../../../src/common/constants/env')

        // Should return default value
        expect(freshModule.getLogLevel()).toBe('debug')

        // Now set an environment variable
        process.env.LOG_LEVEL = 'error'
        jest.resetModules()
        const newerModule = require('../../../src/common/constants/env')

        expect(newerModule.getLogLevel()).toBe('error')
      })
    })

    describe('isProduction', () => {
      it('should check production status from config service when available', () => {
        envModule.setConfigService(mockConfigService)

        // Test for production
        mockConfigService.get.mockReturnValueOnce('production')
        expect(envModule.isProduction()).toBe(true)
        expect(mockConfigService.get).toHaveBeenCalledWith('app.nodeEnv')

        // Test for non-production
        mockConfigService.get.mockReturnValueOnce('development')
        expect(envModule.isProduction()).toBe(false)
      })

      it('should fall back to process.env when config service not set', () => {
        // Create a new module instance without setting config service
        process.env.NODE_ENV = 'development'
        jest.resetModules()
        const freshModule = require('../../../src/common/constants/env')

        expect(freshModule.isProduction()).toBe(false)

        // Now set to production
        process.env.NODE_ENV = 'production'
        jest.resetModules()
        const newerModule = require('../../../src/common/constants/env')

        expect(newerModule.isProduction()).toBe(true)
      })
    })

    describe('getPort', () => {
      it('should get port from config service when available', () => {
        envModule.setConfigService(mockConfigService)
        mockConfigService.get.mockReturnValueOnce(4000)

        const result = envModule.getPort()

        expect(mockConfigService.get).toHaveBeenCalledWith('app.port')
        expect(result).toBe(4000)
      })

      it('should fall back to process.env when config service not set', () => {
        // Create a new module instance without setting config service
        delete process.env.PORT
        jest.resetModules()
        const freshModule = require('../../../src/common/constants/env')

        // Should return default value
        expect(freshModule.getPort()).toBe(8080)

        // Now set an environment variable
        process.env.PORT = '5000'
        jest.resetModules()
        const newerModule = require('../../../src/common/constants/env')

        expect(newerModule.getPort()).toBe('5000')
      })
    })
  })
})
