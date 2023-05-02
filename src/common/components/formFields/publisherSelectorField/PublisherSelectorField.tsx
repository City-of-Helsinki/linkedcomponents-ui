import { FieldProps } from 'formik';
import React from 'react';

import PublisherSelector, {
  PublisherSelectorProps,
} from '../../publisherSelector/PublisherSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = PublisherSelectorProps & FieldProps<string>;

const PublisherSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  disabled,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    disabled,
    name,
    onBlur,
    onChange,
    value,
  });

  return (
    <PublisherSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      helper={helper}
      error={errorText}
      invalid={!!errorText}
    />
  );
};

export default PublisherSelectorField;
