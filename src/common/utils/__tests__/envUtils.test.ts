import { afterEach, describe, expect, it } from 'vitest';

import { getEnvValue } from '../envUtils';

type WindowWithEnv = Window & { _env_?: Record<string, unknown> };

const windowWithEnv = () => globalThis.window as WindowWithEnv;

const TEST_KEY = 'TEST_ENV_UTILS_VALUE';
const TEST_IMPORT_META_KEY = 'TEST_ENV_UTILS_IMPORT_META';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setRuntimeEnv = (value: any) => {
  windowWithEnv()._env_ = {
    [TEST_KEY]: value,
  };
};

describe('getEnvValue', () => {
  const runtimeEnv = windowWithEnv()._env_;
  const processEnvBackup = { ...process.env };
  const importMetaEnv = import.meta.env as Record<string, string | undefined>;
  const importMetaBackupValue = importMetaEnv[TEST_IMPORT_META_KEY];

  afterEach(() => {
    windowWithEnv()._env_ = runtimeEnv;
    process.env = { ...processEnvBackup };
    importMetaEnv[TEST_IMPORT_META_KEY] = importMetaBackupValue;
  });

  it.each([
    [123, '123'],
    [true, 'true'],
    [BigInt(9007199254740991), '9007199254740991'],
    ['test-value', 'test-value'],
  ])('coerces runtime-injected value %s to string %s', (input, expected) => {
    setRuntimeEnv(input);

    expect(getEnvValue(TEST_KEY)).toBe(expected);
  });

  it('skips runtime env object value and falls back to next source', () => {
    setRuntimeEnv({ nested: true });
    process.env[TEST_KEY] = 'from-process-env';

    expect(getEnvValue(TEST_KEY)).toBe('from-process-env');
  });

  it('falls back to process.env when runtime env value is missing', () => {
    windowWithEnv()._env_ = undefined;
    process.env[TEST_KEY] = 'from-process-env';

    expect(getEnvValue(TEST_KEY)).toBe('from-process-env');
  });

  it('falls back to import.meta.env when runtime and process env are missing', () => {
    windowWithEnv()._env_ = undefined;
    delete process.env[TEST_IMPORT_META_KEY];
    importMetaEnv[TEST_IMPORT_META_KEY] = 'from-import-meta';

    expect(getEnvValue(TEST_IMPORT_META_KEY)).toBe('from-import-meta');
  });

  it('returns undefined when key is missing from all sources', () => {
    windowWithEnv()._env_ = {};
    delete process.env[TEST_KEY];
    delete importMetaEnv[TEST_KEY];

    expect(getEnvValue(TEST_KEY)).toBeUndefined();
  });
});
