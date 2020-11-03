import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DatepickerField from '../../../../common/components/formFields/DatepickerField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import InputRow from '../../../../common/components/inputRow/InputRow';
import Notification from '../../../../common/components/notification/Notification';
import { EVENT_FIELDS } from '../../constants';

const TypeSection = () => {
  const { t } = useTranslation();
  const [{ value: type }] = useField(EVENT_FIELDS.TYPE);

  return (
    <>
      <h3>{t(`event.form.titleTime.${type}`)}</h3>

      <InputRow info={<Notification label={'TODO'} type="info"></Notification>}>
        <FormGroup>
          <Field
            component={DatepickerField}
            name={EVENT_FIELDS.START_TIME}
            label={t(`event.form.labelStartTime.${type}`)}
            placeholder={t('event.form.placeholderStartTime')}
            required={true}
            timeSelector={true}
          />
        </FormGroup>
        <FormGroup>
          <Field
            component={DatepickerField}
            name={EVENT_FIELDS.END_TIME}
            label={t(`event.form.labelEndTime.${type}`)}
            placeholder={t('event.form.placeholderEndTime')}
            required={true}
            timeSelector={true}
          />
        </FormGroup>
      </InputRow>
    </>
  );
};

export default TypeSection;
