import { FieldArray, useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import { EVENT_FIELDS } from '../../constants';
import { EventTime as EventTimeType } from '../../types';
import { getEmptyOccasion } from '../../utils';
import EventTime from './Occasion';
import TimeSectionRow from './TimeSectionRow';

const getOccasionPath = (index: number) =>
  `${EVENT_FIELDS.OCCASIONS}[${index}]`;

const Occasions = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: eventTimes }] = useField({
    name: EVENT_FIELDS.OCCASIONS,
  });

  return (
    <FieldArray
      name={EVENT_FIELDS.OCCASIONS}
      render={(arrayHelpers) => (
        <div>
          {eventTimes.map((event: EventTimeType, index: number) => {
            return (
              <EventTime
                occasionPath={getOccasionPath(index)}
                onDelete={() => arrayHelpers.remove(index)}
                type={type}
              />
            );
          })}
          <TimeSectionRow
            input={
              <Button
                type="button"
                fullWidth={true}
                onClick={() => arrayHelpers.push(getEmptyOccasion())}
                iconLeft={<IconPlus />}
                variant="primary"
              >
                {t('event.form.buttonAddOccasion')}
              </Button>
            }
          />
        </div>
      )}
    />
  );
};

export default Occasions;
