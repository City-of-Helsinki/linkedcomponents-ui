import { FieldArray, useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../common/components/button/Button';
import { EVENT_FIELDS } from '../../../constants';
import FieldWithButton from '../../../layout/FieldWithButton';
import { Offer as OfferType } from '../../../types';
import { getEmptyOffer } from '../../../utils';
import Offer from './offer/Offer';

const getOfferPath = (index: number) => `${EVENT_FIELDS.OFFERS}[${index}]`;

interface Props {
  isEditingAllowed: boolean;
}

const Offers: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const [{ value: offers }] = useField<OfferType[]>({
    name: EVENT_FIELDS.OFFERS,
  });

  return (
    <FieldArray
      name={EVENT_FIELDS.OFFERS}
      render={(arrayHelpers) => (
        <>
          {offers.map((_, index: number) => {
            return (
              <Offer
                key={index}
                isEditingAllowed={isEditingAllowed}
                offerPath={getOfferPath(index)}
                onDelete={() => arrayHelpers.remove(index)}
                showDelete={offers.length > 1}
              />
            );
          })}

          <FieldWithButton>
            <Button
              type="button"
              fullWidth={true}
              onClick={() => arrayHelpers.push(getEmptyOffer())}
              iconLeft={<IconPlus />}
              variant="primary"
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
