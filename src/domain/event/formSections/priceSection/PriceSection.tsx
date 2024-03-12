import { Field, useField } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { featureFlagUtils } from '../../../../utils/featureFlags';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import usePriceGroupOptions from '../../../priceGroup/hooks/usePriceGroupOptions';
import { PriceGroupOption } from '../../../priceGroup/types';
import { EVENT_FIELDS } from '../../constants';
import FreeEventFields from './freeEventFields/FreeEventFields';
import Offers from './offers/Offers';
import PriceNotification from './priceNotification/PriceNotification';
import ValidationError from './validationError/ValidationError';

interface Props {
  isEditingAllowed: boolean;
}

const PriceSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: hasPrice }] = useField({ name: EVENT_FIELDS.HAS_PRICE });
  const [{ value: publisher }] = useField<string>(EVENT_FIELDS.PUBLISHER);

  const [, , { setValue: setPriceGroupOptions }] = useField<PriceGroupOption[]>(
    EVENT_FIELDS.PRICE_GROUP_OPTIONS
  );

  const { options: priceGroupOptions } = usePriceGroupOptions({ publisher });

  useEffect(() => {
    setPriceGroupOptions(priceGroupOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceGroupOptions]);

  return (
    <Fieldset heading={t('event.form.sections.price')} hideLegend>
      <h3>{t(`event.form.titlePriceInfo.${type}`)}</h3>
      <FieldRow notification={<PriceNotification />}>
        <FieldColumn>
          <FormGroup>
            <Field
              component={CheckboxField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelHasPrice.${type}`)}
              name={EVENT_FIELDS.HAS_PRICE}
            />
          </FormGroup>
          {featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') && (
            <Field
              component={CheckboxField}
              disabled={!isEditingAllowed || !hasPrice}
              label={t(`event.form.labelIsRegistrationPlanned.${type}`)}
              name={EVENT_FIELDS.IS_REGISTRATION_PLANNED}
            />
          )}

          <ValidationError />
        </FieldColumn>
      </FieldRow>

      {hasPrice ? (
        <Offers isEditingAllowed={isEditingAllowed} />
      ) : (
        <FreeEventFields isEditingAllowed={isEditingAllowed} />
      )}
    </Fieldset>
  );
};

export default PriceSection;
