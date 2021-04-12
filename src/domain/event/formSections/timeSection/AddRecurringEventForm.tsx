import { FastField, Formik } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import CheckboxGroupField from '../../../../common/components/formFields/CheckboxGroupField';
import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import NumberInputField from '../../../../common/components/formFields/NumberInputField';
import TimepickerField from '../../../../common/components/formFields/TimepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { WEEK_DAY } from '../../../../constants';
import {
  RECURRING_EVENT_FIELDS,
  RECURRING_EVENT_INITIAL_VALUES,
} from '../../constants';
import styles from '../../eventPage.module.scss';
import { RecurringEventSettings } from '../../types';
import {
  generateEventTimesFromRecurringEvent,
  recurringEventValidationSchema,
} from '../../utils';
import { sortEventTimes } from './utils';

interface Props {
  eventType: string;
  onSubmit: (values: RecurringEventSettings) => void;
}

const AddRecurringEventForm: React.FC<Props> = ({ eventType, onSubmit }) => {
  const { t } = useTranslation();
  const weekDayOptions = Object.values(WEEK_DAY).map((weekday) => ({
    label: t(`form.weekDayAbbreviation.${weekday}`),
    value: weekday,
  }));

  return (
    <Formik
      initialValues={RECURRING_EVENT_INITIAL_VALUES}
      onSubmit={(values, { resetForm, validateForm }) => {
        onSubmit({
          ...values,
          eventTimes: generateEventTimesFromRecurringEvent(values).sort(
            sortEventTimes
          ),
        });
        resetForm();
        validateForm();
      }}
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={recurringEventValidationSchema}
    >
      {({ handleSubmit, isValid }) => {
        return (
          <div>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <FastField
                    component={NumberInputField}
                    helperText={t(
                      `event.form.helperRecurringEventRepeatInterval`
                    )}
                    label={t(
                      `event.form.labelRecurringEventRepeatInterval.${eventType}`
                    )}
                    min={1}
                    max={4}
                    name={RECURRING_EVENT_FIELDS.REPEAT_INTERVAL}
                    required={true}
                  />
                </div>
              </div>
            </FormGroup>

            <h3>{t('event.form.titleRecurringEventRepeatDays')}</h3>
            <FormGroup>
              <FastField
                component={CheckboxGroupField}
                columns={4}
                name={RECURRING_EVENT_FIELDS.REPEAT_DAYS}
                options={weekDayOptions}
              />
            </FormGroup>
            <FormGroup>
              <FastField
                component={DatepickerField}
                name={RECURRING_EVENT_FIELDS.START_DATE}
                label={t('event.form.labelRecurringEventStartDate')}
                placeholder={t('common.placeholderDate')}
                required={true}
                timeSelector={false}
              />
            </FormGroup>
            <FormGroup>
              <FastField
                component={DatepickerField}
                name={RECURRING_EVENT_FIELDS.END_DATE}
                label={t('event.form.labelRecurringEventEndDate')}
                placeholder={t('common.placeholderDate')}
                required={true}
                timeSelector={false}
              />
            </FormGroup>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <FastField
                    component={TimepickerField}
                    name={RECURRING_EVENT_FIELDS.START_TIME}
                    label={t(
                      `event.form.labelRecurringEventStartTime.${eventType}`
                    )}
                    placeholder={t('common.placeholderTime')}
                    required={true}
                  />
                </div>
                <div>
                  <FastField
                    component={TimepickerField}
                    name={RECURRING_EVENT_FIELDS.END_TIME}
                    label={t(
                      `event.form.labelRecurringEventEndTime.${eventType}`
                    )}
                    placeholder={t('common.placeholderTime')}
                    required={true}
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup className={styles.buttonWrapper}>
              <Button
                disabled={!isValid}
                fullWidth={true}
                iconLeft={<IconPlus aria-hidden={true} />}
                onClick={() => handleSubmit()}
                type="button"
              >
                {t(`event.form.buttonAddRecurringEvent.${eventType}`)}
              </Button>
            </FormGroup>
          </div>
        );
      }}
    </Formik>
  );
};

export default AddRecurringEventForm;
