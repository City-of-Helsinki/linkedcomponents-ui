import { Field, Formik } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import { EVENT_TIME_FIELDS } from '../../constants';
import { EventTime } from '../../types';
import { eventTimeValidationSchema } from '../../utils';

interface Props {
  addEventTime: (eventTime: EventTime) => void;
  eventType: string;
  savedEvent?: EventFieldsFragment;
}

const AddEventTimeForm: React.FC<Props> = ({
  addEventTime,
  eventType,
  savedEvent,
}) => {
  const { t } = useTranslation();
  const disabled =
    savedEvent && savedEvent.superEventType !== SuperEventType.Recurring;

  return (
    <Formik
      initialValues={{ endTime: null, startTime: null }}
      onSubmit={(values, { resetForm, validateForm }) => {
        addEventTime({
          id: null,
          endTime: values.endTime,
          startTime: values.startTime,
        });
        resetForm();
        validateForm();
      }}
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={eventTimeValidationSchema}
    >
      {({ handleSubmit, isValid }) => {
        return (
          <div>
            <FormGroup>
              <Field
                component={DatepickerField}
                disabled={disabled}
                name={EVENT_TIME_FIELDS.START_TIME}
                label={t(`event.form.labelStartTime.${eventType}`)}
                placeholder={t('common.placeholderDateTime')}
                required={true}
                timeSelector={true}
              />
            </FormGroup>
            <FormGroup>
              <Field
                component={DatepickerField}
                disabled={disabled}
                name={EVENT_TIME_FIELDS.END_TIME}
                label={t(`event.form.labelEndTime.${eventType}`)}
                placeholder={t('common.placeholderDateTime')}
                required={true}
                timeSelector={true}
              />
            </FormGroup>
            <Button
              disabled={disabled || !isValid}
              fullWidth={true}
              iconLeft={<IconPlus />}
              onClick={() => handleSubmit()}
              type="button"
            >
              {t('event.form.buttonAddEventTime')}
            </Button>
          </div>
        );
      }}
    </Formik>
  );
};

export default AddEventTimeForm;
