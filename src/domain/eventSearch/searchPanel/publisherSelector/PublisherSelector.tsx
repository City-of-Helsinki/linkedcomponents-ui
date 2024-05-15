import React from 'react';

import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import skipFalsyType from '../../../../utils/skipFalsyType';
import useOrganizationOptions from '../../../organization/hooks/useOrganizationOptions';

export type PublisherSelectorProps = { value: string[] } & Omit<
  MultiselectDropdownProps,
  'options' | 'value'
>;

const PublisherSelector: React.FC<PublisherSelectorProps> = ({
  id,
  toggleButtonLabel,
  value,
  ...rest
}) => {
  const [searchValue, setSearchValue] = React.useState('');

  const { loading, options } = useOrganizationOptions();

  return (
    <MultiSelectDropdown
      {...rest}
      id={id}
      options={options}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      showSearch={true}
      showLoadingSpinner={loading}
      toggleButtonLabel={toggleButtonLabel}
      value={value
        .map((v) => options.find((o) => o.value === v))
        .filter(skipFalsyType)}
    />
  );
};

export default PublisherSelector;
