import { FieldArray, useField } from 'formik';
import { Button, ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import PriceGroup from '../../../../../../registration/formSections/priceGroups/priceGroup/PriceGroup';
import { RegistrationPriceGroupFormFields } from '../../../../../../registration/types';
import { getEmptyRegistrationPriceGroup } from '../../../../../../registration/utils';
import { EVENT_FIELDS, EVENT_OFFER_FIELDS } from '../../../../../constants';
import FieldWithButton from '../../../../../layout/FieldWithButton';

const getPriceGroupPath = (priceGroupPath: string, index: number) =>
  `${priceGroupPath}[${index}]`;

interface Props {
  isEditingAllowed: boolean;
  offerPath: string;
}

const OfferPriceGroups: React.FC<Props> = ({ isEditingAllowed, offerPath }) => {
  const { t } = useTranslation();

  const priceGroupsPath = `${offerPath}.${EVENT_OFFER_FIELDS.OFFER_PRICE_GROUPS}`;
  const [{ value: priceGroups }] = useField<RegistrationPriceGroupFormFields[]>(
    { name: priceGroupsPath }
  );
  const [{ value: publisher }] = useField<string>({
    name: EVENT_FIELDS.PUBLISHER,
  });

  return (
    <FieldArray
      name={priceGroupsPath}
      render={(arrayHelpers) => (
        <>
          {priceGroups.map((priceGroup, index) => {
            return (
              <PriceGroup
                key={index}
                isEditingAllowed={isEditingAllowed}
                onDelete={() => arrayHelpers.remove(index)}
                publisher={publisher}
                priceGroup={priceGroup}
                priceGroups={priceGroups}
                priceGroupPath={getPriceGroupPath(priceGroupsPath, index)}
                showDelete={true}
              />
            );
          })}

          <FieldWithButton>
            <Button
              type="button"
              disabled={!isEditingAllowed}
              fullWidth={true}
              onClick={() =>
                arrayHelpers.push(getEmptyRegistrationPriceGroup())
              }
              iconStart={<IconPlus />}
              variant={ButtonVariant.Primary}
            >
              {t('registration.form.buttonAddPriceGroup')}
            </Button>
          </FieldWithButton>
        </>
      )}
    />
  );
};

export default OfferPriceGroups;
