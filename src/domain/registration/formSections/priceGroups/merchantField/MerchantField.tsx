import { Field } from 'formik';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import SingleSelectField from '../../../../../common/components/formFields/singleSelectField/SingleSelectField';
import useOrganizationMerchantOptions from '../../../../organization/hooks/useOrganizationMerchantOptions';

type Props = {
  disabled: boolean;
  name: string;
  publisher: string;
  required?: boolean;
};

const MerchantField: FC<Props> = ({ disabled, name, publisher, required }) => {
  const { t } = useTranslation();
  const { loading, options } = useOrganizationMerchantOptions({
    organizationId: publisher,
  });

  return (
    <Field
      component={SingleSelectField}
      disabled={disabled}
      isLoading={loading}
      label={t('registration.form.registrationMerchant.labelMerchant')}
      name={name}
      options={options}
      placeholder={t(
        'registration.form.registrationMerchant.placeholderMerchant'
      )}
      required={required}
    />
  );
};

export default MerchantField;
