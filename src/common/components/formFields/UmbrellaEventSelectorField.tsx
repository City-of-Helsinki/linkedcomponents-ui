import { FieldProps } from 'formik';
import React from 'react';

import { OptionType } from '../../../types';
import UmbrellaEventSelector, {
  UmbrellaEventSelectorProps,
} from '../umbrellaEventSelector/UmbrellaEventSelector';

type Props = UmbrellaEventSelectorProps & FieldProps;

const UmbrellaEventSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  ...rest
}) => {
  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType) => {
    onChange({ target: { id: name, value: selected.value } });
  };

  return (
    <UmbrellaEventSelector
      {...rest}
      {...field}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
    />
  );
};

export default UmbrellaEventSelectorField;
