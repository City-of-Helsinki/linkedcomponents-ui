import React from 'react';

import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import skipFalsyType from '../../../../utils/skipFalsyType';
import useEventTypeOptions from '../../../event/hooks/useEventTypeOptions';

export type TypeSelectorProps = { value: string[] } & Omit<
  MultiselectDropdownProps,
  'options' | 'value'
>;

const TypeSelector: React.FC<TypeSelectorProps> = ({
  id,
  toggleButtonLabel,
  value,
  ...rest
}) => {
  const options = useEventTypeOptions();

  return (
    <MultiSelectDropdown
      {...rest}
      options={options}
      showSearch={true}
      toggleButtonLabel={toggleButtonLabel}
      value={value
        .map((type) =>
          options.find(
            (item) =>
              item.value.toLocaleLowerCase() === type.toLocaleLowerCase()
          )
        )
        .filter(skipFalsyType)}
    />
  );
};

export default TypeSelector;
