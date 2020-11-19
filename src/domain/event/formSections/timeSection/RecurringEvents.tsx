import { FieldArray, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { EVENT_FIELDS } from '../../constants';
import { RecurringEventSettings } from '../../types';
import RecurringEvent from './RecurringEvent';

const RecurringEvents = () => {
  const { t } = useTranslation();
  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });

  const [{ value: recurringEvents }] = useField({
    name: EVENT_FIELDS.RECURRING_EVENTS,
  });

  return (
    <FieldArray
      name={EVENT_FIELDS.RECURRING_EVENTS}
      render={(arrayHelpers) => (
        <>
          {!!recurringEvents.length && (
            <h3>{t('event.form.titleRecurringEvent')}</h3>
          )}
          {recurringEvents.map(
            (settings: RecurringEventSettings, index: number) => {
              return (
                <FormGroup>
                  <RecurringEvent
                    key={index}
                    onDelete={() => {
                      arrayHelpers.remove(index);
                    }}
                    recurringEvent={settings}
                    type={type}
                  />
                </FormGroup>
              );
            }
          )}
        </>
      )}
    />
  );
};

export default RecurringEvents;
