import { FieldProps, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import getValue from '../../../../utils/getValue';
import { getErrorText } from '../../../../utils/validationUtils';
import SingleKeywordSelector, {
  SingleKeywordSelectorProps,
} from '../../singleKeywordSelector/SingleKeywordSelector';

type Props = SingleKeywordSelectorProps & FieldProps;

const SingleKeywordSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType | null) => {
    onChange({ target: { id: name, value: getValue(selected?.value, null) } });
  };

  return (
    <SingleKeywordSelector
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

export default SingleKeywordSelectorField;
