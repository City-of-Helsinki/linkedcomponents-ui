import { Field, useField } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Fieldset from '../../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../../common/components/formFields/checkboxField/CheckboxField';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import getValue from '../../../../utils/getValue';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';
import FieldColumn from '../../../app/layout/fieldColumn/FieldColumn';
import FieldRow from '../../../app/layout/fieldRow/FieldRow';
import useEventPublisher from '../../../event/hooks/useEventPublisher';
import usePriceGroupOptions from '../../../priceGroup/hooks/usePriceGroupOptions';
import { PriceGroupOption } from '../../../priceGroup/types';
import { REGISTRATION_FIELDS } from '../../constants';
import PriceGroups from './PriceGroups';
import styles from './priceGroupSection.module.scss';
import PriceGroupValidationError from './priceGroupValidationError/PriceGroupValidationError';

interface Props {
  isEditingAllowed: boolean;
}

const PriceGroupsSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();
  const [{ value: hasPrice }] = useField<boolean>(
    REGISTRATION_FIELDS.HAS_PRICE
  );
  const [{ value: eventAtId }] = useField<string | null>(
    REGISTRATION_FIELDS.EVENT
  );

  const [, , { setValue: setPriceGroupOptions }] = useField<PriceGroupOption[]>(
    REGISTRATION_FIELDS.PRICE_GROUP_OPTIONS
  );

  const eventId = getValue(parseIdFromAtId(eventAtId), '');
  const { publisher } = useEventPublisher({ eventId });
  const { options: priceGroupOptions } = usePriceGroupOptions({ publisher });

  useEffect(() => {
    setPriceGroupOptions(priceGroupOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceGroupOptions]);

  return (
    <Fieldset heading={t('registration.form.sections.priceGroups')} hideLegend>
      <FormGroup className={styles.hasPrice}>
        <Field
          component={CheckboxField}
          disabled={!isEditingAllowed}
          label={t('registration.form.registrationPriceGroup.labelHasPrice')}
          name={REGISTRATION_FIELDS.HAS_PRICE}
        />
      </FormGroup>
      <FieldRow>
        <FieldColumn>
          <PriceGroupValidationError />
        </FieldColumn>
      </FieldRow>
      {hasPrice && <PriceGroups isEditingAllowed={isEditingAllowed} />}
    </Fieldset>
  );
};

export default PriceGroupsSection;
