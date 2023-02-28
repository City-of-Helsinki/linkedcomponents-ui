import { FieldProps } from 'formik';
import React from 'react';

import PlaceSelector, {
  PlaceSelectorProps,
} from '../../placeSelector/PlaceSelector';
import useComboboxFieldProps from '../hooks/useComboboxFieldProps';

type Props = PlaceSelectorProps & FieldProps<string>;

const PlaceSelectorField: React.FC<Props> = ({
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
    <PlaceSelector
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

export default PlaceSelectorField;
