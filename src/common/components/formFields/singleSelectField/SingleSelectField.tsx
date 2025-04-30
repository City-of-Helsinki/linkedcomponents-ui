import { FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SingleSelect, {
  SingleSelectProps,
} from '../../singleSelect/SingleSelect';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleSelectProps &
  FieldProps & { onChangeCb?: (val: string | null) => void };

const SingleSelectField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  onChangeCb,
  options,
  disabled,
  ...rest
}) => {
  const { t } = useTranslation();
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    disabled,
    name,
    onBlur,
    onChange,
    onChangeCb,
    value,
  });

  return (
    <SingleSelect
      clearButtonAriaLabel={
        /* istanbul ignore next */
        t('common.clear') ?? undefined
      }
      {...rest}
      {...field}
      disabled={disabled}
      id={name}
      onBlur={handleBlur}
      onChange={handleChange}
      options={options}
      value={
        options.find((option) => option.value === value) ??
        (null as unknown as undefined)
      }
      helper={helper}
      error={errorText}
      invalid={!!errorText}
    />
  );
};

export default SingleSelectField;
