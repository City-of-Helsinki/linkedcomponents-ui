import { FieldProps, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import { getErrorText } from '../../../../utils/validationUtils';
import RadioButton from '../../radioButton/RadioButton';
import SelectionGroup, {
  SelectionGroupProps,
} from '../../selectionGroup/SelectionGroup';

type Props = {
  options: OptionType[];
} & FieldProps &
  SelectionGroupProps;

const RadioButtonGroupField: React.FC<Props> = ({
  columns = 2,
  field: { name, value, ...field },
  label,
  form,
  options,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { error, touched }] = useField(name);
  const errorText = getErrorText(error, touched, t);

  return (
    <SelectionGroup {...rest} columns={columns} errorText={errorText}>
      {options.map((option) => (
        <RadioButton
          key={option.value}
          {...field}
          id={`${name}-${option.value}`}
          name={name}
          checked={value === option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </SelectionGroup>
  );
};

export default RadioButtonGroupField;
