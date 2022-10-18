import React from 'react';

import formatDate from '../../../../utils/formatDate';
import FilterTag, { FilterTagProps } from '../FilterTag';

export type DateFilterTagProps = {
  end: Date | null;
  start: Date | null;
} & Omit<FilterTagProps, 'text' | 'type' | 'value'>;

const DateFilterTag: React.FC<DateFilterTagProps> = ({
  end,
  start,
  ...rest
}) => {
  const dateText =
    end || start ? `${formatDate(start)} - ${formatDate(end)}` : '';

  return <FilterTag {...rest} text={dateText} type="date" value={dateText} />;
};

export default DateFilterTag;
