import { Field } from 'formik';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import SingleSelectField from '../../../../../common/components/formFields/singleSelectField/SingleSelectField';
import useOrganizationAccountOptions from '../../../../organization/hooks/useOrganizationAccountOptions';

type Props = {
  disabled: boolean;
  name: string;
  onChangeCb?: (val: string | null) => void;
  publisher: string;
  required?: boolean;
};

const AccountField: FC<Props> = ({
  disabled,
  name,
  onChangeCb,
  publisher,
  required,
}) => {
  const { t } = useTranslation();
  const { loading, options } = useOrganizationAccountOptions({
    organizationId: publisher,
  });

  return (
    <Field
      component={SingleSelectField}
      disabled={disabled}
      isLoading={loading}
      label={t('registration.form.registrationAccount.labelAccount')}
      name={name}
      onChangeCb={onChangeCb}
      options={options}
      placeholder={t(
        'registration.form.registrationAccount.placeholderAccount'
      )}
      required={required}
    />
  );
};

export default AccountField;
