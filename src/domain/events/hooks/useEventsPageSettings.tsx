import { useMemo, useReducer } from 'react';

import {
  expandedEventsInitialState,
  listOptionsInitialState,
} from '../constants';
import { reducers } from '../reducers';
import { EventListOptionsState, EventsPageSettingsState } from '../types';
import {
  addExpandedEvent as addExpandedEventFn,
  removeExpandedEvent as removeExpandedEventFn,
  setEventListOptions as setEventListOptionsFn,
} from '../utils';

const useEventsPageSettings = (): EventsPageSettingsState => {
  const [expandedEvents, dispatchExpandedEventsState] = useReducer(
    reducers.expandedEventsReducer,
    expandedEventsInitialState
  );

  const [listOptions, dispatchListOptionsState] = useReducer(
    reducers.eventListOptionsReducer,
    listOptionsInitialState
  );

  const actions = useMemo(() => {
    return {
      addExpandedEvent: (id: string) =>
        addExpandedEventFn({ dispatchExpandedEventsState, id }),
      removeExpandedEvent: (id: string) =>
        removeExpandedEventFn({ dispatchExpandedEventsState, id }),
      setEventListOptions: (listOptions: Partial<EventListOptionsState>) =>
        setEventListOptionsFn({ dispatchListOptionsState, listOptions }),
    };
  }, []);

  return {
    expandedEvents,
    listOptions,
    ...actions,
  };
};

export default useEventsPageSettings;
