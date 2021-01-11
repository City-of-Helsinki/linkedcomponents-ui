import { render, screen } from '@testing-library/react';
import React from 'react';

import DateText, { DateTextProps } from '../DateText';

const renderComponent = (props: DateTextProps) =>
  render(<DateText {...props} />);

test('should render correct text when startTime and endTime at same day', () => {
  renderComponent({
    endTime: new Date('2021-01-04'),
    startTime: new Date('2021-01-04'),
  });
  screen.getByText('04.01.2021');
});

test('should render correct text when startTime and endTime are defined', () => {
  renderComponent({
    endTime: new Date('2021-01-24'),
    startTime: new Date('2021-01-04'),
  });
  screen.getByText('04.01.2021 – 24.01.2021');
});

test('should render correct text when only startTime is defined', () => {
  renderComponent({
    endTime: null,
    startTime: new Date('2021-01-24'),
  });
  screen.getByText('24.01.2021 –');
});

test('should render correct text when only endTime is defined', () => {
  renderComponent({
    endTime: new Date('2021-01-04'),
    startTime: null,
  });
  screen.getByText('– 04.01.2021');
});

test('should render correct text when startTime and endTime are not defined', () => {
  renderComponent({
    endTime: null,
    startTime: null,
  });
  screen.getByText('-');
});
