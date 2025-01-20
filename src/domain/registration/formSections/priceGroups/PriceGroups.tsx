import { ArrayHelpers, FieldArray, useField } from 'formik';
import { Button, ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import getValue from '../../../../utils/getValue';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import useEventPublisher from '../../../event/hooks/useEventPublisher';
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
    { name: REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS }
  );
  const [{ value: eventAtId }] = useField<string>({
    name: REGISTRATION_FIELDS.EVENT,
  });
  const { publisher } = useEventPublisher({
    eventId: getValue(parseIdFromAtId(eventAtId), ''),
  });

  return (
    <FieldArray
      name={REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS}
      render={(arrayHelpers: ArrayHelpers) => (
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

export default PriceGroups;
