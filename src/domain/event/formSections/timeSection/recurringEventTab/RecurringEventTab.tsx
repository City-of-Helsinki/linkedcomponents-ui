import React from 'react';
import { useTranslation } from 'react-i18next';

import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import { RecurringEventSettings } from '../../../types';
import AddRecurringEventForm from '../addRecurringEventForm/AddRecurringEventForm';
import EventTimesSummary from '../eventTimesSummary/EventTimesSummary';
import TimeSectionContext from '../TimeSectionContext';
import TimeSectionNotification from '../timeSectionNotification/TimeSectionNotification';
import { sortRecurringEvents } from '../utils';
import ValidationError from '../validationError/ValidationError';

const RecurringEventTab: React.FC = () => {
  const { t } = useTranslation();
  const { recurringEvents, setRecurringEvents } =
    React.useContext(TimeSectionContext);

  const addRecurringEvent = (recurringEvent: RecurringEventSettings) => {
    const sortedRecurringEvents = [...recurringEvents];
    sortedRecurringEvents.push(recurringEvent);
    sortedRecurringEvents.sort(sortRecurringEvents);
    setRecurringEvents(sortedRecurringEvents);
  };

  return (
    <>
      <h3>{t('event.form.titleRecurringEvent')}</h3>
      <FieldRow notification={<TimeSectionNotification />}>
        <FieldColumn>
          <AddRecurringEventForm onSubmit={addRecurringEvent} />
          <ValidationError />
        </FieldColumn>
        <EventTimesSummary />
      </FieldRow>
    </>
  );
};

export default RecurringEventTab;
