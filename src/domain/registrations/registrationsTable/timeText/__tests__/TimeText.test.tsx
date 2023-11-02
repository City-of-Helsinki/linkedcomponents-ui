import { render } from '@testing-library/react';
import React from 'react';

import TimeText, { TimeTextProps } from '../TimeText';

const renderComponent = (props: TimeTextProps) =>
  render(<TimeText {...props} />);

test('should render correct text when startTime and endTime are defined', () => {
  const { container } = renderComponent({
    startTime: new Date('2021-07-13T05:00:00.000000Z'),
    endTime: new Date('2021-08-15T12:15:00.000000Z'),
  });
  expect(container).toMatchSnapshot();
});

test('should render correct text when only startTime is defined', () => {
  const { container } = renderComponent({
    startTime: new Date('2021-07-13T05:00:00.000000Z'),
    endTime: null,
  });
  expect(container).toMatchSnapshot();
});

test('should render correct text when only endTime is defined', () => {
  const { container } = renderComponent({
    endTime: new Date('2021-08-15T12:15:00.000000Z'),
    startTime: null,
  });
  expect(container).toMatchSnapshot();
});

test('should render correct text when startTime and endTime are not defined', () => {
  const { container } = renderComponent({
    endTime: null,
    startTime: null,
  });
  expect(container).toMatchSnapshot();
});
