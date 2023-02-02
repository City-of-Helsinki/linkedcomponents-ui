import formatDate from 'date-fns/format';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Collapsible from '../../../../../../common/components/collapsible/Collapsible';
import DeleteButton from '../../../../../../common/components/deleteButton/DeleteButton';
import { DATE_FORMAT } from '../../../../../../constants';
import getDateFromString from '../../../../../../utils/getDateFromString';
import FieldWithButton from '../../../../layout/FieldWithButton';
import { EventTime, RecurringEventSettings } from '../../../../types';
import { sortWeekDays } from '../../../../utils';
import EventTimesTable from '../../eventTimesTable/EventTimesTable';
import styles from '../../timeSection.module.scss';

type Props = {
  index: number;
  onDelete: (index: number) => void;
  onUpdateEventTimes: (index: number, eventTimes: EventTime[]) => void;
  recurringEvent: RecurringEventSettings;
  startIndex: number;
};

const RecurringEvent: React.FC<Props> = ({
  index,
  onDelete,
  onUpdateEventTimes,
  recurringEvent,
  startIndex,
}) => {
  const { endDate, startDate } = useMemo(() => {
    return {
      endDate: getDateFromString(recurringEvent.endDate),
      startDate: getDateFromString(recurringEvent.startDate),
    };
  }, [recurringEvent]);

  const { t } = useTranslation();
  const sortedRepeatDays = [...recurringEvent.repeatDays].sort(sortWeekDays);

  const weekDayAbbreviations = sortedRepeatDays.map((day) =>
    t(`form.weekDayAbbreviation.${day}`)
  );

  const getWeekDaysText = (days: string[]) =>
    days.length > 1
      ? `${days.slice(0, days.length - 1).join(', ')} ${t('common.and')} ${
          days[days.length - 1]
        }`
      : days.join('');

  const weekDayAbbreviationsText = getWeekDaysText(weekDayAbbreviations);

  const title = [
    weekDayAbbreviationsText,
    t(`event.form.recurringEvent.textRepeatInterval`, {
      count: recurringEvent.repeatInterval,
    }),
    t('common.betweenDates', {
      startDate: startDate && formatDate(startDate, DATE_FORMAT),
      endDate: endDate && formatDate(endDate, DATE_FORMAT),
    }),
  ].join(', ');

  return (
    <FieldWithButton
      hasLabel={false}
      button={
        <DeleteButton
          ariaLabel={t('event.form.buttonDeleteRecurringEvent')}
          className={styles.deleteButton}
          onClick={() => {
            onDelete(index);
          }}
        />
      }
    >
      <Collapsible headingLevel={3} title={title}>
        <EventTimesTable
          eventTimes={recurringEvent.eventTimes}
          setEventTimes={(eventTimes: EventTime[]) => {
            onUpdateEventTimes(index, eventTimes);
          }}
          startIndex={startIndex}
        />
      </Collapsible>
    </FieldWithButton>
  );
};

export default RecurringEvent;
