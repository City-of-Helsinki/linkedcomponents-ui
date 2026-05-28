import { act, render, screen } from '@testing-library/react';
import React, { useState } from 'react';

import useInterval from '../useInterval';

const TestInterval = ({ delay }: { delay: number | null }) => {
  const [n, setN] = useState(0);
  useInterval(() => setN((x) => x + 1), delay);
  return <div data-testid="tick-count">{n}</div>;
};

afterEach(() => {
  vi.useRealTimers();
});

test('increments on each interval when delay is a number', () => {
  vi.useFakeTimers();
  render(<TestInterval delay={1000} />);

  expect(screen.getByTestId('tick-count')).toHaveTextContent('0');

  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByTestId('tick-count')).toHaveTextContent('1');

  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByTestId('tick-count')).toHaveTextContent('2');
});

test('does not schedule callbacks when delay is null', () => {
  vi.useFakeTimers();
  render(<TestInterval delay={null} />);

  act(() => {
    vi.advanceTimersByTime(10_000);
  });
  expect(screen.getByTestId('tick-count')).toHaveTextContent('0');
});

test('stops firing when delay changes from number to null', () => {
  vi.useFakeTimers();
  const { rerender } = render(<TestInterval delay={1000} />);

  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByTestId('tick-count')).toHaveTextContent('1');

  rerender(<TestInterval delay={null} />);
  act(() => {
    vi.advanceTimersByTime(10_000);
  });
  expect(screen.getByTestId('tick-count')).toHaveTextContent('1');
});
