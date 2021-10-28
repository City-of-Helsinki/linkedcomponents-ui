import React from 'react';

import { getEventDateText } from '../utils';

export interface DateTextProps {
  endTime: Date | null;
  startTime: Date | null;
}

const DateText: React.FC<DateTextProps> = ({ endTime, startTime }) => {
  return <>{getEventDateText(endTime, startTime)}</>;
};

export default DateText;
