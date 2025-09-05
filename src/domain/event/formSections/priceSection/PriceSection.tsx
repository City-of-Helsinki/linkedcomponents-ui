import { Field, useField } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import HeadingWithTooltip from '../../../../common/components/headingWithTooltip/HeadingWithTooltip';
import { EventFieldsFragment } from '../../../../generated/graphql';
import { featureFlagUtils } from '../../../../utils/featureFlags';
import FormRow from '../../../admin/layout/formRow/FormRow';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import usePriceGroupOptions from '../../../priceGroup/hooks/usePriceGroupOptions';
import { PriceGroupOption } from '../../../priceGroup/types';
import VatPercentageField from '../../../registration/formSections/priceGroups/vatPercentageField/VatPercentageField';
import useUser from '../../../user/hooks/useUser';
import { EVENT_FIELDS } from '../../constants';
import {
  shouldShowRegistrationPriceGroupFields,
  showTooltipInstructions,
} from '../../utils';
import FreeEventFields from './freeEventFields/FreeEventFields';
import Offers from './offers/Offers';
import PriceInstructions from './priceInstructions/PriceInstructions';
import ValidationError from './validationError/ValidationError';

interface Props {
  event?: EventFieldsFragment | null;
  isEditingAllowed: boolean;
  isAdminUser: boolean;
}

const PriceSection: React.FC<Props> = ({
  event,
  isEditingAllowed,
  isAdminUser,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const [{ value: hasPrice }] = useField({ name: EVENT_FIELDS.HAS_PRICE });
  const [{ value: isRegistrationPlanned }] = useField({
    name: EVENT_FIELDS.IS_REGISTRATION_PLANNED,
  });
  const [{ value: publisher }] = useField<string>(EVENT_FIELDS.PUBLISHER);

  const [, , { setValue: setPriceGroupOptions }] = useField<PriceGroupOption[]>(
    EVENT_FIELDS.PRICE_GROUP_OPTIONS
  );

  const { options: priceGroupOptions } = usePriceGroupOptions({ publisher });

  useEffect(() => {
    setPriceGroupOptions(priceGroupOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceGroupOptions]);

  const showRegistrationPriceGroupFields =
    shouldShowRegistrationPriceGroupFields({
      event,
      isRegistrationPlanned,
      user,
    });

  return (
    <Fieldset heading={t('event.form.sections.price')} hideLegend>
      <HeadingWithTooltip
        heading={t(`event.form.titlePriceInfo.${type}`)}
        showTooltip={showTooltipInstructions(user)}
        tag="h3"
        tooltipContent={<PriceInstructions eventType={type} />}
        tooltipLabel={t(`event.form.titlePriceInfo.${type}`)}
      />

      <FieldRow>
        <FieldColumn>
          <FormGroup>
            <Field
              component={CheckboxField}
              disabled={!isEditingAllowed}
              label={t(`event.form.labelHasPrice.${type}`)}
              name={EVENT_FIELDS.HAS_PRICE}
            />
          </FormGroup>
          {featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') &&
            isAdminUser && (
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
        <>
          {showRegistrationPriceGroupFields && (
            <FormRow>
              <FieldColumn>
                <VatPercentageField
                  disabled={!isEditingAllowed}
                  name={EVENT_FIELDS.OFFERS_VAT_PERCENTAGE}
                  required={true}
                />
              </FieldColumn>
            </FormRow>
          )}

          <Offers
            isEditingAllowed={isEditingAllowed}
            showRegistrationPriceGroupFields={showRegistrationPriceGroupFields}
          />
        </>
      ) : (
        <FreeEventFields isEditingAllowed={isEditingAllowed} />
      )}
    </Fieldset>
  );
};

export default PriceSection;
