import React from 'react';

import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import skipFalsyType from '../../../../utils/skipFalsyType';
import useEventStatusOptions from '../../../event/hooks/useEventStatusOptions';

export type EventStatusSelectorProps = { value: string[] } & Omit<
  MultiselectDropdownProps,
  'options' | 'value'
>;

const EventStatusSelector: React.FC<EventStatusSelectorProps> = ({
  id,
  toggleButtonLabel,
  value,
  ...rest
}) => {
  const options = useEventStatusOptions();

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
              item.value?.toLocaleLowerCase() === type.toLocaleLowerCase()
          )
        )
        .filter(skipFalsyType)}
    />
  );
};

export default EventStatusSelector;
