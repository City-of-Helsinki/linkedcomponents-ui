import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { INPUT_MAX_WIDTHS } from '../../../../constants';
import { EVENT_FIELDS } from '../../constants';
import InputWrapper from '../InputWrapper';
import Offers from './Offers';

const LanguagesSection = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({
    name: EVENT_FIELDS.TYPE,
  });
  const [{ value: hasPrice }] = useField({
    name: EVENT_FIELDS.HAS_PRICE,
  });

  return (
    <>
      <InputWrapper
        columns={10}
        inputColumns={8}
        maxWidth={INPUT_MAX_WIDTHS.MEDIUM}
      >
        <h3>{t(`event.form.titlePriceInfo.${type}`)}</h3>
        <FormGroup>
          <Field
            label={t(`event.form.labelHasPrice.${type}`)}
            name={EVENT_FIELDS.HAS_PRICE}
            component={CheckboxField}
          />
        </FormGroup>
      </InputWrapper>
      {hasPrice && <Offers />}
    </>
  );
};

export default LanguagesSection;
