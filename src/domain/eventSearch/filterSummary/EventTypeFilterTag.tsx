import React from 'react';

import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import FilterTag, { FilterTagProps } from './FilterTag';

type Props = Omit<FilterTagProps, 'text' | 'type'>;

const EventTypeFilterTag: React.FC<Props> = ({ value, ...rest }) => {
  const eventTypeOptions = useEventTypeOptions();

  return (
    <FilterTag
      {...rest}
      text={
        eventTypeOptions.find((item) => item.value === value)?.label ||
        /* istanbul ignore next */ '-'
      }
      type="type"
      value={value}
    />
  );
};

export default EventTypeFilterTag;
