import { render, screen } from '@testing-library/react';
import React from 'react';

import { fakeOffers } from '../../../../utils/mockDataUtils';
import PriceText, { PriceTextProps } from '../PriceText';

const renderComponent = (props: PriceTextProps) =>
  render(<PriceText {...props} />);

test('should render correct text when event is free', () => {
  renderComponent({ freeEvent: true, offers: [] });
  expect(screen.getByText('Maksuton')).toBeInTheDocument();
});

test('should render correct text when event is not free and offers are set', () => {
  renderComponent({
    freeEvent: false,
    offers: fakeOffers(2, [
      { price: { fi: 'Hinta 1' }, isFree: false },
      { price: { fi: 'Hinta 2' }, isFree: false },
    ]),
  });
  expect(screen.getByText('Hinta 1, Hinta 2')).toBeInTheDocument();
});

test('should render correct text when event is not free but offers are empty', () => {
  renderComponent({
    freeEvent: false,
    offers: [],
  });
  expect(screen.getByText('-')).toBeInTheDocument();
});
