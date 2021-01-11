import { FieldProps, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { getErrorText } from '../../../utils/validationUtils';
import KeywordSelector, {
  KeywordSelectorProps,
} from '../keywordSelector/KeywordSelector';

type Props = KeywordSelectorProps & FieldProps;

const KeywordSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = React.useMemo(() => getErrorText(error, touched, t), [
    error,
    t,
    touched,
  ]);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType[]) => {
    onChange({
      target: { id: name, value: selected.map((item) => item.value) },
    });
  };

  return (
    <KeywordSelector
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

export default KeywordSelectorField;
