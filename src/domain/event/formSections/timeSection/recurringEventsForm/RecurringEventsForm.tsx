import { FastField, Form, Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import CheckboxGroupField from '../../../../../common/components/formFields/CheckboxGroupField';
import DatepickerField from '../../../../../common/components/formFields/DatepickerField';
import SingleComboboxField from '../../../../../common/components/formFields/SingleComboboxField';
import TimepickerField from '../../../../../common/components/formFields/TimepickerField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { WEEK_DAY } from '../../../../../constants';
import {
  RECURRING_EVENT_FIELDS,
  RECURRING_EVENT_INITIAL_VALUES,
} from '../../../constants';
import { createRecurringEventValidationSchema } from '../../../utils';
import styles from './recurringEventsForm.module.scss';

interface Props {
  onSubmit: () => void;
  type: string;
}

const RecurringEventsForm: React.FC<Props> = ({ onSubmit, type }) => {
  const { t } = useTranslation();
  const intervalOptions = range(1, 5).map((weeks) => ({
    label: weeks.toString(),
    value: weeks,
  }));
  const weekDayOptions = Object.values(WEEK_DAY).map((weekday) => ({
    label: t(`form.weekDayAbbreviation.${weekday}`),
    value: weekday,
  }));

  return (
    <Formik
      initialValues={RECURRING_EVENT_INITIAL_VALUES}
      onSubmit={(values) => {
        onSubmit();
      }}
      validationSchema={createRecurringEventValidationSchema}
    >
      {() => {
        return (
          <Form>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <h3>{t('event.form.titleRecurringEventRepeatInterval')}</h3>
                  <FastField
                    component={SingleComboboxField}
                    columns={4}
                    name={RECURRING_EVENT_FIELDS.REPEAT_INTERVAL}
                    options={intervalOptions}
                    required={true}
                  />
                </div>
                <div>
                  <h3>{t('event.form.titleRecurringEventRepeatDays')}</h3>
                  <FastField
                    component={CheckboxGroupField}
                    columns={4}
                    name={RECURRING_EVENT_FIELDS.REPEAT_DAYS}
                    options={weekDayOptions}
                  />
                </div>
              </div>
            </FormGroup>
            <h3>{t('event.form.titleRecurringEventStarts')}</h3>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <FastField
                    component={DatepickerField}
                    name={RECURRING_EVENT_FIELDS.START_DATE}
                    label={t('event.form.labelRecurringEventStartDate')}
                    placeholder={t(
                      'event.form.placeholderRecurringEventStartDate'
                    )}
                    required={true}
                    timeSelector={false}
                  />
                </div>
                <div>
                  <FastField
                    component={DatepickerField}
                    name={RECURRING_EVENT_FIELDS.END_DATE}
                    label={t('event.form.labelRecurringEventEndDate')}
                    placeholder={t(
                      'event.form.placeholderRecurringEventEndDate'
                    )}
                    required={true}
                    timeSelector={false}
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className={styles.splittedRow}>
                <div>
                  <FastField
                    component={TimepickerField}
                    name={RECURRING_EVENT_FIELDS.START_TIME}
                    label={t(`event.form.labelRecurringEventStartTime.${type}`)}
                    placeholder={t(
                      'event.form.placeholderRecurringEventStartTime'
                    )}
                    required={true}
                  />
                </div>
                <div>
                  <FastField
                    component={TimepickerField}
                    name={RECURRING_EVENT_FIELDS.END_TIME}
                    label={t(`event.form.labelRecurringEventEndTime.${type}`)}
                    placeholder={t(
                      'event.form.placeholderRecurringEventEndTime'
                    )}
                    required={true}
                  />
                </div>
              </div>
            </FormGroup>
            <FormGroup className={styles.buttonWrapper}>
              <div className={styles.splittedRow}>
                <div></div>
                <div>
                  <Button fullWidth={true} type="submit">
                    {t('event.form.buttonAddRecurringEvent')}
                  </Button>
                </div>
              </div>
            </FormGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RecurringEventsForm;
