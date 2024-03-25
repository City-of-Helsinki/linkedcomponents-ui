import React from 'react';

import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { EventTime } from '../../../types';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import RecurringEvent from './recurringEvent/RecurringEvent';

const RecurringEvents: React.FC = () => {
  const { recurringEvents, setRecurringEvents } = useTimeSectionContext();

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

  return (
    <>
      {recurringEvents.map((recurringEvent, index) => {
        return (
          <FormGroup key={index}>
            <RecurringEvent
              key={recurringEvent.toString()}
              index={index}
              onDelete={handleDelete}
              onUpdateEventTimes={handleUpdateEventTimes}
              recurringEvent={recurringEvent}
            />
          </FormGroup>
        );
      })}
    </>
  );
};

export default RecurringEvents;
