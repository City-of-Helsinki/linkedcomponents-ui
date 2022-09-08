/* eslint-disable @typescript-eslint/no-explicit-any */
import merge from 'lodash/merge';

import { defaultStoreState } from '../constants';
import {
  EventListOptionsState,
  ExpandedEventsState,
  ReducerState as EventsState,
} from '../domain/events/types';
import { StoreState } from '../types';

export const fakeStoreState = (overrides?: Partial<StoreState>): StoreState =>
  merge<StoreState, typeof overrides>({ ...defaultStoreState }, overrides);

export const fakeEventsState = (
  overrides?: Partial<EventsState>
): EventsState =>
  merge<EventsState, typeof overrides>(
    {
      expandedEvents: fakeExpandedEventsState(),
      listOptions: fakeEventsListOptionsState(),
    },
    overrides
  );

export const fakeEventsListOptionsState = (
  overrides?: Partial<EventListOptionsState>
): EventListOptionsState =>
  merge<EventListOptionsState, typeof overrides>(
    { ...defaultStoreState.events.listOptions },
    overrides
  );

export const fakeExpandedEventsState = (
  overrides?: Partial<ExpandedEventsState>
): ExpandedEventsState =>
  merge<ExpandedEventsState, typeof overrides>(
    { ...defaultStoreState.events.expandedEvents },
    overrides
  );
