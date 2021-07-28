import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { EVENT_FIELDS } from '../../constants';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import Offers from './Offers';
import ValidationError from './ValidationError';

const PriceSection: React.FC = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: hasPrice }] = useField({ name: EVENT_FIELDS.HAS_PRICE });

  return (
    <>
      <h3>{t(`event.form.titlePriceInfo.${type}`)}</h3>
      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <Field
              label={t(`event.form.labelHasPrice.${type}`)}
              name={EVENT_FIELDS.HAS_PRICE}
              component={CheckboxField}
            />
            <ValidationError />
          </FormGroup>
        </FieldColumn>
      </FieldRow>
      {hasPrice && <Offers />}
    </>
  );
};

export default PriceSection;
