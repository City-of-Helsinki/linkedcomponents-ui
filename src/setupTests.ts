/* eslint-disable no-console */
import 'jest-axe/extend-expect';
import './test/testI18nInit';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'jest-localstorage-mock';

import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

// Mock scrollTo function
window.scrollTo = jest.fn();

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

jest.setTimeout(1000000);

process.env.REACT_APP_ENABLE_EXTERNAL_USER_EVENTS = 'true';
