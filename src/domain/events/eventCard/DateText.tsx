import isSameDay from 'date-fns/isSameDay';
import React from 'react';

import formatDate from '../../../utils/formatDate';

export interface DateTextProps {
  endTime: Date | null;
  startTime: Date | null;
}

const DateText: React.FC<DateTextProps> = ({ endTime, startTime }) => {
  const getText = () => {
    if (startTime && endTime) {
      return isSameDay(new Date(startTime), new Date(endTime))
        ? formatDate(new Date(startTime))
        : `${formatDate(new Date(startTime))} – ${formatDate(
            new Date(endTime)
          )}`;
    } else if (startTime) {
      return `${formatDate(new Date(startTime))} –`;
    } else if (endTime) {
      return `– ${formatDate(new Date(endTime))}`;
    }
    return '-';
  };
  return <>{getText()}</>;
};

export default DateText;
