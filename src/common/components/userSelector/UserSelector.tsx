import React from 'react';
import { useTranslation } from 'react-i18next';

import useAllUsers from '../../../domain/user/hooks/useAllUsers';
import { getUserFields } from '../../../domain/user/utils';
import { UserFieldsFragment } from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import Combobox, { MultiComboboxProps } from '../combobox/Combobox';

const getOption = ({ user }: { user: UserFieldsFragment }): OptionType => {
  const { username: value, displayName, email } = getUserFields(user);

  return {
    label: `${displayName} - ${email}`,
    value,
  };
};

export type UserSelectorProps = MultiComboboxProps<string>;

const UserSelector: React.FC<UserSelectorProps> = ({
  label,
  name,
  value,
  ...rest
}) => {
  const { t } = useTranslation();

  const { users } = useAllUsers();

  const options: OptionType[] = React.useMemo(
    () =>
      getValue(
        users.map((user) => getOption({ user })),
        []
      ),
    [users]
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
