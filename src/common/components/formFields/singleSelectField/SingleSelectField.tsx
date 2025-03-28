import { FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import SingleSelect, {
  SingleSelectProps,
} from '../../singleSelect/SingleSelect';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleSelectProps &
  FieldProps & { onChangeCb?: (val: string | null) => void };

const SingleSelectField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  texts,
  onChangeCb,
  options,
  disabled,
  ...rest
}) => {
  const { t } = useTranslation();
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    name,
    onBlur,
    onChange,
    onChangeCb,
    value,
  });

  const selected = options?.find(
    (option): option is OptionType =>
      typeof option !== 'string' && option.value === value
  );

  return (
    <SingleSelect
      {...rest}
      {...field}
      disabled={disabled}
      id={name}
      onBlur={handleBlur}
      onChange={handleChange}
      options={options}
      value={selected?.value}
      texts={{
        ...texts,
        error: errorText,
        clearButtonAriaLabel_one: t('common.clear') ?? undefined,
      }}
      invalid={!!errorText}
    />
  );
};

export default SingleSelectField;
