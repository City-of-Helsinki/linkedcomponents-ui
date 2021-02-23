import { defaultStoreState } from '../../../constants';
import {
  DEFAULT_EVENT_LIST_TYPE,
  DEFAULT_EVENT_SORT,
  DEFAULT_EVENT_TAB,
} from '../constants';
import {
  eventListPageSelector,
  eventListSortSelector,
  eventListTabSelector,
  eventListTypeSelector,
} from '../selectors';

test('eventListPageSelector return selected page', () => {
  expect(eventListPageSelector(defaultStoreState)).toBe(1);
});

test('eventListSortSelector return selected sort', () => {
  expect(eventListSortSelector(defaultStoreState)).toBe(DEFAULT_EVENT_SORT);
});

test('eventListTabSelector return selected tab', () => {
  expect(eventListTabSelector(defaultStoreState)).toBe(DEFAULT_EVENT_TAB);
});

test('eventListTypeSelector return selected list type', () => {
  expect(eventListTypeSelector(defaultStoreState)).toBe(
    DEFAULT_EVENT_LIST_TYPE
  );
});
