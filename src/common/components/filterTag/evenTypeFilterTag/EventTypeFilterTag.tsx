import React from 'react';

import useEventTypeOptions from '../../../../domain/event/hooks/useEventTypeOptions';
import getValue from '../../../../utils/getValue';
import FilterTag, { FilterTagProps } from '../FilterTag';

type Props = Omit<FilterTagProps, 'text' | 'type'>;

const EventTypeFilterTag: React.FC<Props> = ({ value, ...rest }) => {
  const eventTypeOptions = useEventTypeOptions();

  return (
    <FilterTag
      {...rest}
      text={getValue(
        eventTypeOptions.find((item) => item.value === value)?.label,
        '-'
      )}
      type="eventType"
      value={value}
    />
  );
};

export default EventTypeFilterTag;
