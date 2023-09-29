import { TEST_EVENT_ID } from '../../event/constants';
import {
  EVENT_LIST_TYPES,
  EventListOptionsActionTypes,
  EVENTS_PAGE_TABS,
  ExpandedEventsActionTypes,
  expandedEventsInitialState,
  listOptionsInitialState,
} from '../constants';
import { eventListOptionsReducer, expandedEventsReducer } from '../reducers';
import {
  EventListOptionsAction,
  EventListOptionsState,
  ExpandedEventsAction,
  ExpandedEventsState,
} from '../types';

describe('eventListOptionsReducer function', () => {
  const cases: [
    EventListOptionsAction,
    EventListOptionsState,
    EventListOptionsState,
  ][] = [
    [
      {
        type: EventListOptionsActionTypes.SET_EVENT_LIST_OPTIONS,
        payload: { listType: EVENT_LIST_TYPES.CARD_LIST },
      },
      listOptionsInitialState,
      {
        listType: EVENT_LIST_TYPES.CARD_LIST,
        tab: EVENTS_PAGE_TABS.WAITING_APPROVAL,
      },
    ],
    [
      {
        type: EventListOptionsActionTypes.SET_EVENT_LIST_OPTIONS,
        payload: { listType: EVENT_LIST_TYPES.TABLE },
      },
      listOptionsInitialState,
      {
        listType: EVENT_LIST_TYPES.TABLE,
        tab: EVENTS_PAGE_TABS.WAITING_APPROVAL,
      },
    ],
    [
      {
        type: EventListOptionsActionTypes.SET_EVENT_LIST_OPTIONS,
        payload: { tab: EVENTS_PAGE_TABS.DRAFTS },
      },
      listOptionsInitialState,
      {
        listType: EVENT_LIST_TYPES.TABLE,
        tab: EVENTS_PAGE_TABS.DRAFTS,
      },
    ],
    [
      {
        type: EventListOptionsActionTypes.SET_EVENT_LIST_OPTIONS,
        payload: { tab: EVENTS_PAGE_TABS.PUBLISHED },
      },
      listOptionsInitialState,
      {
        listType: EVENT_LIST_TYPES.TABLE,
        tab: EVENTS_PAGE_TABS.PUBLISHED,
      },
    ],
    [
      {
        type: EventListOptionsActionTypes.SET_EVENT_LIST_OPTIONS,
        payload: { tab: EVENTS_PAGE_TABS.WAITING_APPROVAL },
      },
      listOptionsInitialState,
      {
        listType: EVENT_LIST_TYPES.TABLE,
        tab: EVENTS_PAGE_TABS.WAITING_APPROVAL,
      },
    ],
  ];

  it.each(cases)(
    'should return correct state with action %p',
    async (action, initialState, state) => {
      expect(eventListOptionsReducer(initialState, action)).toEqual(state);
    }
  );
});

describe('expandedEventsReducer function', () => {
  const cases: [
    ExpandedEventsAction,
    ExpandedEventsState,
    ExpandedEventsState,
  ][] = [
    [
      {
        type: ExpandedEventsActionTypes.ADD_EXPANDED_EVENT,
        payload: TEST_EVENT_ID,
      },
      expandedEventsInitialState,
      [TEST_EVENT_ID],
    ],
    [
      {
        type: ExpandedEventsActionTypes.ADD_EXPANDED_EVENT,
        payload: TEST_EVENT_ID,
      },
      [TEST_EVENT_ID],
      [TEST_EVENT_ID],
    ],
    [
      {
        type: ExpandedEventsActionTypes.REMOVE_EXPANDED_EVENT,
        payload: TEST_EVENT_ID,
      },
      [TEST_EVENT_ID],
      [],
    ],
    [
      {
        type: ExpandedEventsActionTypes.REMOVE_EXPANDED_EVENT,
        payload: TEST_EVENT_ID,
      },
      [TEST_EVENT_ID, 'event:2'],
      ['event:2'],
    ],
    [
      {
        type: ExpandedEventsActionTypes.REMOVE_EXPANDED_EVENT,
        payload: TEST_EVENT_ID,
      },
      [TEST_EVENT_ID, 'event:2', 'event:2'],
      ['event:2'],
    ],
  ];

  it.each(cases)(
    'should return correct state with action %p',
    async (action, initialState, state) => {
      expect(expandedEventsReducer(initialState, action)).toEqual(state);
    }
  );
});
