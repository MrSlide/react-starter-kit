import chalk from 'chalk'
import prettyFormatter from '.'
import { LogLevel } from '../../types'

describe('Pretty log formatter', function () {
  test('formats debug logs correctly', function () {
    const log = {
      level: LogLevel.debug,
      message: 'Test message',
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.blueBright('DEBUG')}: ${chalk.bold('Test message')}`)
  })

  test('formats debug logs with payloads correctly', function () {
    const log = {
      arrayProp: [1, 2, 3],
      level: LogLevel.debug,
      message: 'Test message',
      testProp: true,
      propWithNesting: {
        testProp: 'test'
      },
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.blueBright('DEBUG')}: ${chalk.bold('Test message')}
${chalk.dim(`  arrayProp: ${chalk.bold('[1,2,3]')}
  testProp: ${chalk.bold('true')}
  propWithNesting: ${chalk.bold('{"testProp":"test"}')}`)}`)
  })

  test('formats info logs correctly', function () {
    const log = {
      level: LogLevel.info,
      message: 'Test message',
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.greenBright('INFO')}: ${chalk.bold('Test message')}`)
  })

  test('formats info logs with payloads correctly', function () {
    const log = {
      arrayProp: [1, 2, 3],
      level: LogLevel.info,
      message: 'Test message',
      testProp: true,
      propWithNesting: {
        testProp: 'test'
      },
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.greenBright('INFO')}: ${chalk.bold('Test message')}
${chalk.dim(`  arrayProp: ${chalk.bold('[1,2,3]')}
  testProp: ${chalk.bold('true')}
  propWithNesting: ${chalk.bold('{"testProp":"test"}')}`)}`)
  })

  test('formats warn logs correctly', function () {
    const log = {
      level: LogLevel.warn,
      message: 'Test message',
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.yellowBright('WARN')}: ${chalk.bold('Test message')}`)
  })

  test('formats warn logs with payloads correctly', function () {
    const log = {
      arrayProp: [1, 2, 3],
      level: LogLevel.warn,
      message: 'Test message',
      testProp: true,
      propWithNesting: {
        testProp: 'test'
      },
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.yellowBright('WARN')}: ${chalk.bold('Test message')}
${chalk.dim(`  arrayProp: ${chalk.bold('[1,2,3]')}
  testProp: ${chalk.bold('true')}
  propWithNesting: ${chalk.bold('{"testProp":"test"}')}`)}`)
  })

  test('formats error logs correctly', function () {
    const log = {
      level: LogLevel.error,
      message: 'Test message',
      stack: `Error: Test message
  at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`,
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.redBright('ERROR')}: ${chalk.bold('Test message')}
${chalk.redBright(`  Error: Test message
    at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`)}`)
  })

  test('formats error logs with payloads correctly', function () {
    const log = {
      arrayProp: [1, 2, 3],
      level: LogLevel.error,
      message: 'Test message',
      stack: `Error: Test message
  at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`,
      testProp: true,
      propWithNesting: {
        testProp: 'test'
      },
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.redBright('ERROR')}: ${chalk.bold('Test message')}
${chalk.redBright(`  Error: Test message
    at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`)}
${chalk.dim(`  arrayProp: ${chalk.bold('[1,2,3]')}
  testProp: ${chalk.bold('true')}
  propWithNesting: ${chalk.bold('{"testProp":"test"}')}`)}`)
  })

  test('formats fatal logs correctly', function () {
    const log = {
      level: LogLevel.fatal,
      message: 'Test message',
      stack: `Error: Test message
  at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`,
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.redBright('FATAL')}: ${chalk.bold('Test message')}
${chalk.redBright(`  Error: Test message
    at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`)}`)
  })

  test('formats fatal logs with payloads correctly', function () {
    const log = {
      arrayProp: [1, 2, 3],
      level: LogLevel.fatal,
      message: 'Test message',
      stack: `Error: Test message
  at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`,
      testProp: true,
      propWithNesting: {
        testProp: 'test'
      },
      timestamp: new Date('2020-05-14T14:48:00.000Z')
    }
    const output = prettyFormatter(log)

    expect(output).toBe(`${chalk.cyan('[2020-05-14T14:48:00.000Z]')} ${chalk.redBright('FATAL')}: ${chalk.bold('Test message')}
${chalk.redBright(`  Error: Test message
    at Object.<anonymous> (src/common/logger/formatters/pretty/index.test.ts:4`)}
${chalk.dim(`  arrayProp: ${chalk.bold('[1,2,3]')}
  testProp: ${chalk.bold('true')}
  propWithNesting: ${chalk.bold('{"testProp":"test"}')}`)}`)
  })
})
