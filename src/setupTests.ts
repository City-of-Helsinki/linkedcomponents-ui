/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import './test/testI18nInit';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';

import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
expect.extend(matchers);

// Mock scrollTo function
window.scrollTo = vi.fn<any>();

const originalWarn = console.warn.bind(console.warn);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.warn = (msg: any, ...optionalParams: any[]) => {
  const msgStr = msg.toString();

  return (
    !msgStr.includes(
      'Using ReactElement as a label is against good usability and accessibility practices.'
    ) &&
    !msgStr.includes(
      'Invalid default value for TimeInput. The default value must be in hh:mm format'
    ) &&
    !msgStr.includes(
      'The current testing environment is not configured to support act(...)'
    ) &&
    !msgStr.match(
      /Could not find the stylesheet to update with the ".*" selector!/i
    ) &&
    !msgStr.match(/No routes matched location "*"/i) &&
    originalWarn(msg, ...optionalParams)
  );
};

const originalError = console.error.bind(console.error);

console.error = (msg: any, ...optionalParams: any[]) => {
  const msgStr = msg.toString();

  return (
    !msgStr.includes('Could not parse CSS stylesheet') &&
    originalError(msg, ...optionalParams)
  );
};

import.meta.env.REACT_APP_ENABLE_EXTERNAL_USER_EVENTS = 'true';
import.meta.env.REACT_APP_MAINTENANCE_SHOW_NOTIFICATION = 'false';
import.meta.env.REACT_APP_MAINTENANCE_DISABLE_LOGIN = 'false';
import.meta.env.REACT_APP_ALLOWED_SUBSTITUTE_USER_DOMAINS = 'hel.fi';
