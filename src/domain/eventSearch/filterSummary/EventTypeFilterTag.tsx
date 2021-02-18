import React from 'react';

import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import FilterTag, { FilterTagProps } from './FilterTag';

type Props = Omit<FilterTagProps, 'text'>;

const EventTypeFilterTag: React.FC<Props> = ({ value, ...rest }) => {
  const eventTypeOptions = useEventTypeOptions();

  return (
    <FilterTag
      {...rest}
      value={value}
      text={eventTypeOptions.find((item) => item.value === value)?.label || '-'}
    />
  );
};

export default EventTypeFilterTag;
