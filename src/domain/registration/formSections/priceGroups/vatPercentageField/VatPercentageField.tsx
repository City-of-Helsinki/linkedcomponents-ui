import { Field } from 'formik';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import SingleSelectField from '../../../../../common/components/formFields/singleSelectField/SingleSelectField';
import useVatOptions from '../../../../priceGroup/hooks/useVatOptions';

type Props = {
  disabled: boolean;
  name: string;
  required?: boolean;
};

const VatPercentageField: FC<Props> = ({ disabled, name, required }) => {
  const { t } = useTranslation();
  const vatOptions = useVatOptions();

  return (
    <Field
      component={SingleSelectField}
      disabled={disabled}
      label={t('registration.form.registrationPriceGroup.labelVatPercentage')}
      name={name}
      options={vatOptions}
      placeholder={t(
        'registration.form.registrationPriceGroup.placeholderVatPercentage'
      )}
      required={required}
    />
  );
};

export default VatPercentageField;
