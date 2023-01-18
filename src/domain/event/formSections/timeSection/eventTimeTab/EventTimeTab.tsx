import React from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../../common/components/fieldset/Fieldset';
import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../../app/layout/fieldRow/FieldRow';
import { EventTime } from '../../../types';
import { isRecurringEvent } from '../../../utils';
import AddEventTimeForm from '../addEventTimeForm/AddEventTimeForm';
import EventTimesSummary from '../eventTimesSummary/EventTimesSummary';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import TimeSectionNotification from '../timeSectionNotification/TimeSectionNotification';
import { sortEventTimes } from '../utils';
import ValidationError from '../validationError/ValidationError';

const EventTimeTab: React.FC = () => {
  const { t } = useTranslation();
  const {
    events,
    eventTimes,
    eventType,
    isUmbrella,
    recurringEvents,
    setEventTimes,
    setIsUmbrella,
  } = useTimeSectionContext();

  const addEventTime = (eventTime: EventTime) => {
    const newEventTimes = [...eventTimes, eventTime];

    if (
      isRecurringEvent([...newEventTimes, ...events], recurringEvents) &&
      isUmbrella
    ) {
      setIsUmbrella(false);
    }
    setEventTimes(newEventTimes.sort(sortEventTimes));
  };

  return (
    <Fieldset
      heading={t(`event.form.titleEnterEventTime.${eventType}`)}
      hideLegend
    >
      <h3>{t(`event.form.titleEnterEventTime.${eventType}`)}</h3>
      <FieldRow notification={<TimeSectionNotification />}>
        <FieldColumn>
          <AddEventTimeForm addEventTime={addEventTime} />
          <ValidationError />
        </FieldColumn>
        <EventTimesSummary />
      </FieldRow>
    </Fieldset>
  );
};

export default EventTimeTab;
