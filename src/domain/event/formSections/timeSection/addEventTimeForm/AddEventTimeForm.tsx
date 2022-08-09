import { Field, Formik, FormikHelpers } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import DateInputField from '../../../../../common/components/formFields/dateInputField/DateInputField';
import TextInputField from '../../../../../common/components/formFields/textInputField/TextInputField';
import TimeInputField from '../../../../../common/components/formFields/timeInputField/TimeInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { SuperEventType } from '../../../../../generated/graphql';
import parseDateText from '../../../../../utils/parseDateText';
import {
  ADD_EVENT_TIME_FORM_NAME,
  EVENT_TIME_FIELDS,
} from '../../../constants';
import styles from '../../../eventPage.module.scss';
import { AddEventTimeFormFields, EventTime } from '../../../types';
import { addEventTimeSchema } from '../../../validation';
import TimeSectionContext from '../TimeSectionContext';

interface Props {
  addEventTime: (eventTime: EventTime) => void;
}

const AddEventTimeForm: React.FC<Props> = ({ addEventTime }) => {
  const [resetTimeInputs, setResetTimeInputs] = React.useState(false);
  const { t } = useTranslation();
  const { eventType, isEditingAllowed, savedEvent } =
    React.useContext(TimeSectionContext);
  const disabled =
    !isEditingAllowed ||
    (savedEvent && savedEvent.superEventType !== SuperEventType.Recurring);

  const submitAddEventTime = (
    values: AddEventTimeFormFields,
    formikHelpers: FormikHelpers<AddEventTimeFormFields>
  ) => {
    const { resetForm, validateForm } = formikHelpers;
    addEventTime({
      id: null,
      endTime: parseDateText(
        values[ADD_EVENT_TIME_FORM_NAME].endDate,
        values[ADD_EVENT_TIME_FORM_NAME].endTime
      ),
      startTime: parseDateText(
        values[ADD_EVENT_TIME_FORM_NAME].startDate,
        values[ADD_EVENT_TIME_FORM_NAME].startTime
      ),
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
      initialValues={
        {
          [ADD_EVENT_TIME_FORM_NAME]: {
            endDate: '',
            endTime: '',
            startDate: '',
            startTime: '',
          },
        } as AddEventTimeFormFields
      }
      onSubmit={submitAddEventTime}
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={addEventTimeSchema}
    >
      {({ handleSubmit, isValid }) => {
        return (
          <div>
            <FormGroup>
              <div className={styles.splittedRow}>
                <Field
                  component={DateInputField}
                  disabled={disabled}
                  label={t(`event.form.labelStartDate.${eventType}`)}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_DATE}`}
                  placeholder={t('common.placeholderDate')}
                  required={true}
                />
                <Field
                  component={
                    // TODO: Remove this hack when time input component is fixed
                    // Unmount time input after form reset to reset the input fields
                    resetTimeInputs ? TextInputField : TimeInputField
                  }
                  disabled={disabled}
                  label={t(`event.form.labelStartTime.${eventType}`)}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.START_TIME}`}
                  placeholder={t('common.placeholderTime')}
                  required={true}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <div className={styles.splittedRow}>
                <Field
                  component={DateInputField}
                  disabled={disabled}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_DATE}`}
                  label={t(`event.form.labelEndDate.${eventType}`)}
                  placeholder={t('common.placeholderDate')}
                  required={true}
                />
                <Field
                  component={
                    // TODO: Remove this hack when time input component is fixed
                    // Unmount time input after form reset to reset the input fields
                    resetTimeInputs ? TextInputField : TimeInputField
                  }
                  disabled={disabled}
                  name={`${ADD_EVENT_TIME_FORM_NAME}.${EVENT_TIME_FIELDS.END_TIME}`}
                  label={t(`event.form.labelEndTime.${eventType}`)}
                  placeholder={t('common.placeholderTime')}
                  required={true}
                />
              </div>
            </FormGroup>
            <Button
              disabled={disabled || !isValid}
              fullWidth={true}
              iconLeft={<IconPlus />}
              onClick={() => handleSubmit()}
              type="button"
            >
              {t(`event.form.buttonAddEventTime.${eventType}`)}
            </Button>
          </div>
        );
      }}
    </Formik>
  );
};

export default AddEventTimeForm;
