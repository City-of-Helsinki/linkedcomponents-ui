import { FieldProps } from 'formik';
import React from 'react';

import PublisherSelector, {
  PublisherSelectorProps,
} from '../../publisherSelector/PublisherSelector';
import useComboboxFieldProps from '../hooks/useComboboxFieldProps';

type Props = PublisherSelectorProps & FieldProps<string>;

const PublisherSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useComboboxFieldProps({
    name,
    onBlur,
    onChange,
    value,
  });

  return (
    <PublisherSelector
      {...rest}
      {...field}
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
