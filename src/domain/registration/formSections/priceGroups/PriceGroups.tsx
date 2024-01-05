import { FieldArray, useField } from 'formik';
import { Button, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import FieldWithButton from '../../../event/layout/FieldWithButton';
import { REGISTRATION_FIELDS } from '../../constants';
import { RegistrationPriceGroupFormFields } from '../../types';
import { getEmptyRegistrationPriceGroup } from '../../utils';
import PriceGroup from './priceGroup/PriceGroup';

const getPriceGroupPath = (index: number) =>
  `${REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS}[${index}]`;

interface Props {
  isEditingAllowed: boolean;
}

const PriceGroups: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const [{ value: priceGroups }] = useField<RegistrationPriceGroupFormFields[]>(
    {
      name: REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS,
    }
  );

  return (
    <FieldArray
      name={REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS}
      render={(arrayHelpers) => (
        <>
          {priceGroups.map((priceGroup, index) => {
            return (
              <PriceGroup
                key={index}
                isEditingAllowed={isEditingAllowed}
                onDelete={() => arrayHelpers.remove(index)}
                priceGroup={priceGroup}
                priceGroupPath={getPriceGroupPath(index)}
                showDelete={priceGroups.length > 1}
              />
            );
          })}

          <FieldWithButton>
            <Button
              type="button"
              fullWidth={true}
              onClick={() =>
                arrayHelpers.push(getEmptyRegistrationPriceGroup())
              }
              iconLeft={<IconPlus />}
              variant="primary"
            >
              {t('registration.form.buttonAddPriceGroup')}
            </Button>
          </FieldWithButton>
        </>
      )}
    />
  );
};

export default PriceGroups;
