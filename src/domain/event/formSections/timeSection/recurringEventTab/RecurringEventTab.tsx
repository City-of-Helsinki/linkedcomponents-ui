import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../../common/components/fieldset/Fieldset';
import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import useUser from '../../../../user/hooks/useUser';
import { RecurringEventSettings } from '../../../types';
import { isRecurringEvent, showNotificationInstructions } from '../../../utils';
import AddRecurringEventForm from '../addRecurringEventForm/AddRecurringEventForm';
import EventTimesSummary from '../eventTimesSummary/EventTimesSummary';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import TimeSectionNotification from '../timeSectionNotification/TimeSectionNotification';
import { sortRecurringEvents } from '../utils';
import ValidationError from '../validationError/ValidationError';

const RecurringEventTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const {
    events,
    eventTimes,
    isUmbrella,
    recurringEvents,
    setIsUmbrella,
    setRecurringEvents,
  } = useTimeSectionContext();

  const addRecurringEvent = (recurringEvent: RecurringEventSettings) => {
    const newRecurringEvents = [...recurringEvents, recurringEvent];

    if (
      isRecurringEvent([...events, ...eventTimes], newRecurringEvents) &&
      isUmbrella
    ) {
      setIsUmbrella(false);
    }

    setRecurringEvents([...newRecurringEvents].sort(sortRecurringEvents));
  };

  return (
    <Fieldset heading={t(`event.form.titleRecurringEvent`)} hideLegend>
      <h3>{t('event.form.titleRecurringEvent')}</h3>
      <FieldRow
        notification={
          showNotificationInstructions(user) ? (
            <TimeSectionNotification />
          ) : undefined
        }
      >
        <FieldColumn>
          <AddRecurringEventForm onSubmit={addRecurringEvent} />
          <ValidationError />
        </FieldColumn>
        <EventTimesSummary />
      </FieldRow>
    </Fieldset>
  );
};

export default RecurringEventTab;
