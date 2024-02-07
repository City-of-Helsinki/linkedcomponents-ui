import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useAllUsers from '../../../domain/user/hooks/useAllUsers';
import { getUserOption } from '../../../domain/user/utils';
import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import Combobox, { MultiComboboxProps } from '../combobox/Combobox';

export type UserSelectorProps = {
  extraOptions?: OptionType[];
} & MultiComboboxProps<string>;

const UserSelector: React.FC<UserSelectorProps> = ({
  extraOptions = [],
  label,
  name,
  value,
  ...rest
}) => {
  const { t } = useTranslation();

  const { users } = useAllUsers();

  const options: OptionType[] = React.useMemo(
    () =>
      sortBy(
        uniqBy(
          [
            ...getValue(
              users.map((user) => getUserOption({ user })),
              []
            ),
            ...extraOptions,
          ],
          'value'
        ),
        'label'
      ),
    [extraOptions, users]
  );

  const selectedUsers = options.filter(({ value: val }) => value.includes(val));

  return (
    <Combobox
      {...rest}
      multiselect={true}
      id={name}
      label={label}
      options={options}
      clearButtonAriaLabel={t('common.combobox.clearUsers')}
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      value={selectedUsers}
    />
  );
};

export default UserSelector;
