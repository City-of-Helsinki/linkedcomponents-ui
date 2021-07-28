import { FieldArray, useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import { EVENT_FIELDS } from '../../constants';
import FieldWithButton from '../../layout/FieldWithButton';
import { Offer as OfferType } from '../../types';
import { getEmptyOffer } from '../../utils';
import Offer from './Offer';

const getOfferPath = (index: number) => `${EVENT_FIELDS.OFFERS}[${index}]`;

const Offers: React.FC = () => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: offers }] = useField<OfferType[]>({
    name: EVENT_FIELDS.OFFERS,
  });

  return (
    <FieldArray
      name={EVENT_FIELDS.OFFERS}
      render={(arrayHelpers) => (
        <div>
          {offers.map((offer, index: number) => {
            return (
              <Offer
                key={index}
                offerPath={getOfferPath(index)}
                onDelete={() => arrayHelpers.remove(index)}
                showInstructions={!index}
                type={type}
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
        </div>
      )}
    />
  );
};

export default Offers;
