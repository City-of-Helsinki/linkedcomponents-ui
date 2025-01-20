import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useAllUsers from '../../../domain/user/hooks/useAllUsers';
import { getUserOption } from '../../../domain/user/utils';
import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import Select, { MultiSelectPropsWithValue } from '../select/Select';

type UserSelectorProps = {
  extraOptions?: OptionType[];
} & MultiSelectPropsWithValue<string>;

const UserSelector: React.FC<UserSelectorProps> = (props) => {
  /* istanbul ignore next */
  const { extraOptions = [], texts, name, value, ...rest } = props;
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

  const selectedUsers = options.filter(({ value: val }) =>
    value.includes(val as string)
  );

  return (
    <Select
      {...rest}
      multiSelect
      id={name}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearUsers'),
      }}
      options={options}
      value={selectedUsers}
    />
  );
};

export default UserSelector;
