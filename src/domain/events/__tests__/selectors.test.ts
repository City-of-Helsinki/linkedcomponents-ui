import { defaultStoreState } from '../../../constants';
import { DEFAULT_EVENT_LIST_TYPE, DEFAULT_EVENT_TAB } from '../constants';
import { eventListTabSelector, eventListTypeSelector } from '../selectors';

test('eventListTabSelector return selected tab', () => {
  expect(eventListTabSelector(defaultStoreState)).toBe(DEFAULT_EVENT_TAB);
});

test('eventListTypeSelector return selected list type', () => {
  expect(eventListTypeSelector(defaultStoreState)).toBe(
    DEFAULT_EVENT_LIST_TYPE
  );
});
