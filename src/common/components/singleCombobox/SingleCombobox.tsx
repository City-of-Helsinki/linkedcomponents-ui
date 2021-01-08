import { SingleSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import Combobox from '../combobox/Combobox';

export type SingleComboboxProps = {
  name: string;
} & SingleSelectProps<OptionType>;

const SingleCombobox: React.FC<SingleComboboxProps> = ({
  label,
  name,
  options,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <Combobox
      {...rest}
      multiselect={false}
      id={name}
      label={label}
      options={options}
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
    />
  );
};

export default SingleCombobox;
