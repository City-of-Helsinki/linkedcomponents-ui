import { useFormikContext } from 'formik';
import React from 'react';

import { OptionType } from '../../../types';
import Tabs from '../tabs/Tabs';

interface Props {
  fields: string[];
  name: string;
  onChange: (selected: string) => void;
  options: OptionType[];
  selectedLanguage: string;
}

const FormLanguageSelector: React.FC<Props> = ({
  children,
  fields,
  name,
  onChange,
  options,
  selectedLanguage,
}) => {
  const { getFieldMeta } = useFormikContext();

  const tabOptions = React.useMemo(
    () =>
      options.map((option) => {
        const errors = fields
          .map((field) => getFieldMeta(`${field}.${option.value}`).error)
          .filter((e) => e);
        const isCompleted = !errors.length;

        return { ...option, isCompleted };
      }),
    [fields, getFieldMeta, options]
  );

  return (
    <Tabs
      name={name}
      onChange={onChange}
      options={tabOptions}
      activeTab={selectedLanguage}
    >
      {children}
    </Tabs>
  );
};

export default FormLanguageSelector;
