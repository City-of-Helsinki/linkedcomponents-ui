import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/CheckboxField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import FieldColumn from '../../../app/layout/FieldColumn';
import FieldRow from '../../../app/layout/FieldRow';
import { EVENT_FIELDS } from '../../constants';
import Offers from './Offers';
import ValidationError from './ValidationError';

interface Props {
  isEditingAllowed: boolean;
}

const PriceSection: React.FC<Props> = ({ isEditingAllowed }) => {
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
              component={CheckboxField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelHasPrice.${type}`)}
              name={EVENT_FIELDS.HAS_PRICE}
            />
            <ValidationError />
          </FormGroup>
        </FieldColumn>
      </FieldRow>
      {hasPrice && <Offers isEditingAllowed={isEditingAllowed} />}
    </>
  );
};

export default PriceSection;
