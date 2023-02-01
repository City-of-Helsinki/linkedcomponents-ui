import React from 'react';
import uuid from 'react-uuid';

import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { EventTime, RecurringEventSettings } from '../../../types';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import RecurringEvent from './recurringEvent/RecurringEvent';

const RecurringEvents: React.FC = () => {
  const { events, recurringEvents, setRecurringEvents } =
    useTimeSectionContext();

  const handleDelete = (index: number) => {
    setRecurringEvents(
      recurringEvents.filter(
        (_, recurringEventIndex) => recurringEventIndex !== index
      )
    );
  };

  const handleUpdateEventTimes = (index: number, eventTimes: EventTime[]) => {
    setRecurringEvents(
      recurringEvents.map((recurringEvent, recurringEventIndex) =>
        recurringEventIndex !== index
          ? recurringEvent
          : { ...recurringEvent, eventTimes }
      )
    );
  };

  const getStartIndex = (index: number) => {
    let startIndex = 1 + events.length;

    recurringEvents.slice(0, index).forEach((recurringEvent) => {
      startIndex = startIndex + recurringEvent.eventTimes.length;
    });
    return startIndex;
  };

  return (
    <>
      {recurringEvents.map(
        (recurringEvent: RecurringEventSettings, index: number) => {
          return (
            <FormGroup key={uuid()}>
              <RecurringEvent
                key={recurringEvent.toString()}
                index={index}
                onDelete={handleDelete}
                onUpdateEventTimes={handleUpdateEventTimes}
                recurringEvent={recurringEvent}
                startIndex={getStartIndex(index)}
              />
            </FormGroup>
          );
        }
      )}
    </>
  );
};

export default RecurringEvents;
