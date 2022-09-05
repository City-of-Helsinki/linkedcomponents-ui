import { Field, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import { EVENT_FIELDS } from '../../constants';
import FreeEventFields from './freeEventFields/FreeEventFields';
import Offers from './offers/Offers';
import ValidationError from './validationError/ValidationError';

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
          <Field
            component={CheckboxField}
            disabled={!isEditingAllowed}
            label={t(`event.form.labelHasPrice.${type}`)}
            name={EVENT_FIELDS.HAS_PRICE}
          />
          <ValidationError />
        </FieldColumn>
      </FieldRow>
      {hasPrice ? (
        <Offers isEditingAllowed={isEditingAllowed} />
      ) : (
        <FreeEventFields isEditingAllowed={isEditingAllowed} />
      )}
    </>
  );
};

export default PriceSection;
