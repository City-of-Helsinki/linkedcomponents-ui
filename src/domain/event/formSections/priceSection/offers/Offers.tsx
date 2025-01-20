import { ArrayHelpers, FieldArray, useField } from 'formik';
import { ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import { EVENT_FIELDS } from '../../../constants';
import FieldWithButton from '../../../layout/FieldWithButton';
import { OfferFields } from '../../../types';
import { getEmptyOffer } from '../../../utils';
import Offer from './offer/Offer';

const getOfferPath = (index: number) => `${EVENT_FIELDS.OFFERS}[${index}]`;

interface Props {
  isEditingAllowed: boolean;
  showRegistrationPriceGroupFields: boolean;
}

const Offers: React.FC<Props> = ({
  isEditingAllowed,
  showRegistrationPriceGroupFields,
}) => {
  const { t } = useTranslation();

  const [{ value: offers }] = useField<OfferFields[]>({
    name: EVENT_FIELDS.OFFERS,
  });

  return (
    <FieldArray
      name={EVENT_FIELDS.OFFERS}
      render={(arrayHelpers: ArrayHelpers) => (
        <>
          {offers.map((_, index) => {
            return (
              <Offer
                key={index}
                isEditingAllowed={isEditingAllowed}
                offerPath={getOfferPath(index)}
                onDelete={() => arrayHelpers.remove(index)}
                showDelete={offers.length > 1}
                showRegistrationPriceGroupFields={
                  showRegistrationPriceGroupFields
                }
              />
            );
          })}

          <FieldWithButton>
            <Button
              type="button"
              disabled={!isEditingAllowed}
              fullWidth={true}
              onClick={() => arrayHelpers.push(getEmptyOffer())}
              iconStart={<IconPlus />}
              variant={ButtonVariant.Primary}
            >
              {t('event.form.buttonAddOffer')}
            </Button>
          </FieldWithButton>
        </>
      )}
    />
  );
};

export default Offers;
