import { FieldProps, useField } from 'formik';
import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { getErrorText } from '../../../utils/validationUtils';
import SingleCombobox from '../singleCombobox/SingleCombobox';

type Props = SingleSelectProps<OptionType> & FieldProps;

const SingleComboboxField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  options,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType | null) => {
    onChange({ target: { id: name, value: selected?.value || null } });
  };

  return (
    <SingleCombobox
      {...rest}
      {...field}
      name={name}
      multiselect={false}
      onBlur={handleBlur}
      onChange={handleChange}
      error={errorText}
      helper={helper}
      invalid={!!errorText}
      options={options}
      value={options.find((option) => option.value === value)}
    />
  );
};

export default SingleComboboxField;
