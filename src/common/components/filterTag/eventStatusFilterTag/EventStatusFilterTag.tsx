import React from 'react';

import useEventStatusOptions from '../../../../domain/event/hooks/useEventStatusOptions';
import getValue from '../../../../utils/getValue';
import FilterTag, { FilterTagProps } from '../FilterTag';

type Props = Omit<FilterTagProps, 'text' | 'type'>;

const EventStatusFilterTag: React.FC<Props> = ({ value, ...rest }) => {
  const options = useEventStatusOptions();

  return (
    <FilterTag
      {...rest}
      text={getValue(
        options.find(
          (item) =>
            item.value?.toLocaleLowerCase() === value.toLocaleLowerCase()
        )?.label,
        '-'
      )}
      type="eventStatus"
      value={value}
    />
  );
};

export default EventStatusFilterTag;
