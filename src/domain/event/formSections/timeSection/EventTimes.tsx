import { FieldArray, useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import { EVENT_FIELDS } from '../../constants';
import FieldWithButton from '../../layout/FieldWithButton';
import { EventTime as EventTimeType } from '../../types';
import { getEmptyEventTime } from '../../utils';
import EventTime from './EventTime';

const getEventTimePath = (index: number) =>
  `${EVENT_FIELDS.EVENT_TIMES}[${index}]`;

const EventTimes = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: eventTimes }] = useField({
    name: EVENT_FIELDS.EVENT_TIMES,
  });

  return (
    <FieldArray
      name={EVENT_FIELDS.EVENT_TIMES}
      render={(arrayHelpers) => (
        <div>
          {eventTimes.map((eventTime: EventTimeType, index: number) => {
            return (
              <EventTime
                key={index}
                eventTimePath={getEventTimePath(index)}
                onDelete={() => arrayHelpers.remove(index)}
                type={type}
              />
            );
          })}
          <FieldWithButton>
            <Button
              type="button"
              fullWidth={true}
              onClick={() => arrayHelpers.push(getEmptyEventTime())}
              iconLeft={<IconPlus />}
              variant="primary"
            >
              {t('event.form.buttonAddEventTime')}
            </Button>
          </FieldWithButton>
        </div>
      )}
    />
  );
};

export default EventTimes;
