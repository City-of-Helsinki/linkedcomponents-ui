import { ErrorMessage, FieldProps } from 'formik';
import { CheckboxProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../../hooks/useLocale';
import sanitizeElementId from '../../../../utils/sanitizeElementId';
import Checkbox from '../../checkbox/Checkbox';
import styles from './checkboxField.module.scss';

type Props = FieldProps & CheckboxProps;

const CheckboxField: React.FC<Props> = ({
  field: { name, value, ...field },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form,
  label,
  ...rest
}) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const fieldId = sanitizeElementId(name);

  return (
    <div>
      <Checkbox
        {...rest}
        {...field}
        id={fieldId}
        name={name}
        checked={value}
        value={value}
        label={label}
      />
      {/* Add key to for error message to be updated when UI language changes */}
      <ErrorMessage key={locale} name={name}>
        {(error: string) => <div className={styles.errorText}>{t(error)}</div>}
      </ErrorMessage>
    </div>
  );
};

export default CheckboxField;
