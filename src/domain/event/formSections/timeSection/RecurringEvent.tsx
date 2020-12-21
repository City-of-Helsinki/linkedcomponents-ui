import formatDate from 'date-fns/format';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Collapsible from '../../../../common/components/collapsible/Collapsible';
import DeleteButton from '../../../../common/components/deleteButton/DeleteButton';
import { DATE_FORMAT, INPUT_MAX_WIDTHS } from '../../../../constants';
import { RecurringEventSettings } from '../../types';
import { sortWeekDays } from '../../utils';
import FieldArrayRow from '../FieldArrayRow';
import styles from './recurringEvent.module.scss';

type Props = {
  onDelete?: () => void;
  recurringEvent: RecurringEventSettings;
  type: string;
};

const RecurringEvent: React.FC<Props> = ({
  onDelete,
  recurringEvent,
  type,
}) => {
  const startDate =
    typeof recurringEvent.startDate === 'string'
      ? new Date(recurringEvent.startDate)
      : recurringEvent.startDate;
  const endDate =
    typeof recurringEvent.endDate === 'string'
      ? new Date(recurringEvent.endDate)
      : recurringEvent.endDate;
  const { t } = useTranslation();
  const sortedRepeatDays = [...recurringEvent.repeatDays].sort(sortWeekDays);

  const weekDays = sortedRepeatDays.map((day) => t(`form.weekDay.${day}`));
  const weekDayAbbreviations = sortedRepeatDays.map((day) =>
    t(`form.weekDayAbbreviation.${day}`)
  );

  const getWeekDaysText = (days: string[]) =>
    days.length > 1
      ? `${days.slice(0, days.length - 1).join(', ')} ${t('common.and')} ${
          days[days.length - 1]
        }`
      : days.join('');

  const weekDaysText = getWeekDaysText(weekDays);

  const weekDayAbbreviationsText = getWeekDaysText(weekDayAbbreviations);

  const title = [
    [
      t(`event.form.recurringEvent.textRepeatInterval`, {
        count: recurringEvent.repeatInterval,
      }),
      weekDayAbbreviationsText,
    ].join(' '),
    t('common.betweenDates', {
      startDate: startDate && formatDate(startDate, DATE_FORMAT),
      endDate: endDate && formatDate(endDate, DATE_FORMAT),
    }),
    t('common.betweenTimes', {
      startTime: recurringEvent.startTime,
      endTime: recurringEvent.endTime,
    }),
  ].join(', ');

  const tableRows = [
    {
      label: t(`event.form.recurringEvent.labelRepeatInterval.${type}`),
      text: t(`event.form.recurringEvent.textRepeatInterval`, {
        count: recurringEvent.repeatInterval,
      }),
    },
    {
      label: t(`event.form.recurringEvent.labelRepeatDays`),
      text: weekDaysText,
    },
    {
      label: t(`event.form.recurringEvent.labelStartTime.${type}`),
      text: t(`common.at`, { time: recurringEvent.startTime }),
    },
    {
      label: t(`event.form.recurringEvent.labelEndTime.${type}`),
      text: t(`common.at`, { time: recurringEvent.endTime }),
    },
    {
      label: t(`event.form.recurringEvent.labelStartDate`),
      text: startDate && formatDate(startDate, DATE_FORMAT),
    },
    {
      label: t(`event.form.recurringEvent.labelEndDate`),
      text: endDate && formatDate(endDate, DATE_FORMAT),
    },
  ];

  return (
    <FieldArrayRow
      hasLabel={false}
      input={
        <Collapsible headingLevel={3} title={title}>
          <table className={styles.recurringEventTable}>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={index}>
                  <th>
                    <div>{row.label}</div>
                  </th>
                  <td>{row.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Collapsible>
      }
      inputWidth={INPUT_MAX_WIDTHS.LARGE}
      button={
        onDelete ? (
          <DeleteButton
            label={t('event.form.buttonDeleteRecurringEvent')}
            onClick={onDelete}
          />
        ) : undefined
      }
    />
  );
};

export default RecurringEvent;
