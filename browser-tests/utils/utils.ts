import { getErrorMessage } from './testcafe.utils';

/* eslint-disable no-undef */
export const removeEmpty = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] &&
        typeof obj[k] === 'object' &&
        removeEmpty(obj[k] as Record<string, unknown>)) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );
  return obj;
};

export const waitRequest = async ({
  findFn,
  interval = 300,
  requestLogger,
  t,
  timeout = 2000,
}: {
  findFn: (r: LoggedRequest) => boolean;
  interval?: number;
  requestLogger: RequestLogger;
  t: TestController;
  timeout?: number;
}): Promise<LoggedRequest> => {
  let timeLeft = timeout;

  while (!requestLogger.requests.find(findFn) && timeLeft > 0) {
    timeLeft -= interval;
    await t.wait(interval);
  }

  await t
    .expect(requestLogger.requests.find(findFn))
    .ok(await getErrorMessage(t));

  return requestLogger.requests.find(findFn) as LoggedRequest;
};
