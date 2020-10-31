import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DatepickerField from '../../../../common/components/formFields/DatepickerField';
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
            component={DatepickerField}
            timeSelector={true}
            placeholder="pp.kk.vvvv hh.mm"
          />
        </div>
      </InputRow>
    </>
  );
};

export default TypeSection;
