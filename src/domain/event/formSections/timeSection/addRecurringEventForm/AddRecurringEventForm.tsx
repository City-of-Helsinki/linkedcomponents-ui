import { Field, Formik, FormikHelpers } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import CheckboxGroupField from '../../../../../common/components/formFields/checkboxGroupField/CheckboxGroupField';
import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField';
import NumberInputField from '../../../../../common/components/formFields/numberInputField/NumberInputField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import TimeInputField from '../../../../../common/components/formFields/timeInputField/TimeInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { WEEK_DAY } from '../../../../../constants';
import { SuperEventType } from '../../../../../generated/graphql';
import SplittedRow from '../../../../app/layout/splittedRow/SplittedRow';
import {
  RECURRING_EVENT_FIELDS,
  RECURRING_EVENT_INITIAL_VALUES,
} from '../../../constants';
import styles from '../../../eventPage.module.scss';
import { RecurringEventSettings } from '../../../types';
import { generateEventTimesFromRecurringEvent } from '../../../utils';
import { recurringEventSchema } from '../../../validation';
import TimeSectionContext from '../TimeSectionContext';
import { sortEventTimes } from '../utils';

interface Props {
  onSubmit: (values: RecurringEventSettings) => void;
}

const AddRecurringEventForm: React.FC<Props> = ({ onSubmit }) => {
  const [resetTimeInputs, setResetTimeInputs] = React.useState(false);
  const { t } = useTranslation();
  const { eventType, isEditingAllowed, savedEvent } =
    React.useContext(TimeSectionContext);

  const disabled =
    !isEditingAllowed ||
    (savedEvent && savedEvent.superEventType !== SuperEventType.Recurring);

  const weekDayOptions = Object.values(WEEK_DAY).map((weekday) => ({
    label: t(`form.weekDayAbbreviation.${weekday}`),
    value: weekday,
  }));

  const submitAddRecurringEvent = (
    values: RecurringEventSettings,
    formikHelpers: FormikHelpers<RecurringEventSettings>
  ) => {
    const { resetForm, validateForm } = formikHelpers;

    onSubmit({
      ...values,
      eventTimes:
        generateEventTimesFromRecurringEvent(values).sort(sortEventTimes),
    });
    resetForm();
    validateForm();
    setResetTimeInputs(true);
  };

  // TODO: Remove this hack when time input component is fixed
  // Unmount time input components after form reset to reset the input fields
  React.useEffect(() => {
    if (resetTimeInputs) {
      setResetTimeInputs(false);
    }
  }, [resetTimeInputs]);

  return (
    <Formik
      initialValues={RECURRING_EVENT_INITIAL_VALUES}
      onSubmit={submitAddRecurringEvent}
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={recurringEventSchema}
    >
      {({ handleSubmit, isValid, values: { startDate } }) => {
        return (
          <div>
            <FormGroup>
              <SplittedRow>
                <div>
                  <Field
                    component={NumberInputField}
                    disabled={disabled}
                    helperText={t(
                      `event.form.recurringEvent.helperRepeatInterval`
                    )}
                    label={t(
                      `event.form.recurringEvent.labelRepeatInterval.${eventType}`
                    )}
                    min={1}
                    max={4}
                    name={RECURRING_EVENT_FIELDS.REPEAT_INTERVAL}
                    required={true}
                  />
                </div>
              </SplittedRow>
            </FormGroup>

            <h3>{t('event.form.recurringEvent.titleRepeatDays')}</h3>
            <FormGroup>
              <Field
                component={CheckboxGroupField}
                columns={4}
                disabled={disabled}
                label={t('event.form.recurringEvent.titleRepeatDays')}
                name={RECURRING_EVENT_FIELDS.REPEAT_DAYS}
                options={weekDayOptions}
                required
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={DateInputField}
                disabled={disabled}
                label={t('event.form.recurringEvent.labelStartDate')}
                name={RECURRING_EVENT_FIELDS.START_DATE}
                placeholder={t('common.placeholderDate')}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={DateInputField}
                disabled={disabled}
                minDate={startDate}
                name={RECURRING_EVENT_FIELDS.END_DATE}
                label={t('event.form.recurringEvent.labelEndDate')}
                placeholder={t('common.placeholderDate')}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <SplittedRow>
                <div>
                  <Field
                    component={
                      // TODO: Remove this hack when time input component is fixed
                      // Unmount time input after form reset to reset the input fields
                      resetTimeInputs ? TextInputField : TimeInputField
                    }
                    disabled={disabled}
                    name={RECURRING_EVENT_FIELDS.START_TIME}
                    label={t(
                      `event.form.recurringEvent.labelStartTime.${eventType}`
                    )}
                    placeholder={t('common.placeholderTime')}
                    required={true}
                  />
                </div>
                <div>
                  <Field
                    component={
                      // TODO: Remove this hack when time input component is fixed
                      // Unmount time input after form reset to reset the input fields
                      resetTimeInputs ? TextInputField : TimeInputField
                    }
                    disabled={disabled}
                    name={RECURRING_EVENT_FIELDS.END_TIME}
                    label={t(
                      `event.form.recurringEvent.labelEndTime.${eventType}`
                    )}
                    placeholder={t('common.placeholderTime')}
                    required={true}
                  />
                </div>
              </SplittedRow>
            </FormGroup>
            <FormGroup className={styles.buttonWrapper}>
              <Button
                disabled={disabled || !isValid}
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
