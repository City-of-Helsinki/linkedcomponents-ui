import { MultiSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useAllUsers from '../../../domain/user/hooks/useAllUsers';
import { getUserFields } from '../../../domain/user/utils';
import { UserFieldsFragment } from '../../../generated/graphql';
import { OptionType } from '../../../types';
import Combobox from '../combobox/Combobox';

const getOption = ({ user }: { user: UserFieldsFragment }): OptionType => {
  const { username: value, displayName, email } = getUserFields(user);

  return {
    label: `${displayName} - ${email}`,
    value,
  };
};

type ValueType = string;

export type UserSelectorProps = {
  name: string;
  value: ValueType[];
} & Omit<MultiSelectProps<OptionType>, 'options' | 'value'>;

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
      users.map((user) => getOption({ user })) ?? /* istanbul ignore next */ [],
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
      toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
      value={selectedUsers}
    />
  );
};

export default UserSelector;
