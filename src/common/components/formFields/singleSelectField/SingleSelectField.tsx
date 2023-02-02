import { FieldProps, useField } from 'formik';
import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import getValue from '../../../../utils/getValue';
import { getErrorText } from '../../../../utils/validationUtils';
import SingleSelect from '../../singleSelect/SingleSelect';

type Props = SingleSelectProps<OptionType> & FieldProps;

const SingleSelectField: React.FC<Props> = ({
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
    onChange({
      target: { id: name, value: getValue(selected?.value, null) },
    });
  };

  return (
    <SingleSelect
      {...rest}
      {...field}
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
