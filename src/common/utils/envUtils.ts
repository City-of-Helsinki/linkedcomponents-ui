/**
 * Get environment variable from globalThis.window._env_
 * globalThis.window._env_ is injected by env-config.js at runtime
 */
function toEnvString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return value.toString();
  }

  return undefined;
}

export function getEnvValue(key: string): string | undefined {
  // Runtime-injected env values for browser deployments.
  const runtimeEnvValue = toEnvString(globalThis.window?._env_?.[key]);
  if (runtimeEnvValue !== undefined) {
    return runtimeEnvValue;
  }

  // Node test/runtime fallback (used by Vitest and server-side tooling).
  const processEnv = (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;
  const processValue = processEnv?.[key];
  if (processValue !== undefined) {
    return processValue;
  }

  // Build-time fallback for environments still relying on Vite replacement.
  const value = (import.meta.env as Record<string, unknown>)[key];
  const normalizedValue = toEnvString(value);
  if (normalizedValue !== undefined) {
    return normalizedValue;
  }

  return undefined;
}
