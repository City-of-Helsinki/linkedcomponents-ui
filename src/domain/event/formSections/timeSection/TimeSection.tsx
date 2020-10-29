import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DatePickerFIeld from '../../../../common/components/formFields/DatePickerFIeld';
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
        <div>
          <Field
            name={EVENT_FIELDS.START_TIME}
            component={DatePickerFIeld}
            timeSelector={true}
          />
        </div>
      </InputRow>
    </>
  );
};

export default TypeSection;
