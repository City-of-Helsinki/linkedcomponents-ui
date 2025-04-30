import { FieldProps } from 'formik';
import React from 'react';

import PlaceSelector, {
  PlaceSelectorProps,
} from '../../placeSelector/PlaceSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = PlaceSelectorProps & FieldProps<string>;

const PlaceSelectorField: React.FC<Props> = ({
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
    <PlaceSelector
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

export default PlaceSelectorField;
