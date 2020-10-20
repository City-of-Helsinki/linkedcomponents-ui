import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import RadioButtonGroupField from '../../../../common/components/formFields/RadioButtonGroupField';
import InputRow from '../../../../common/components/inputRow/InputRow';
import { OptionType } from '../../../../types';
import { EVENT_TYPE } from '../../constants';

const TypeSection = () => {
  const { t } = useTranslation();
  const typeOptions: OptionType[] = [EVENT_TYPE.EVENT, EVENT_TYPE.COURSE].map(
    (type) => ({
      label: t(`event.type.${type}`),
      value: type,
    })
  );

  return (
    <>
      <h2>{t('event.form.titleEventType')}</h2>
      <InputRow>
        <Field
          name="type"
          component={RadioButtonGroupField}
          options={typeOptions}
        />
      </InputRow>
    </>
  );
};

export default TypeSection;
