import React from 'react';

import {
  fakeLocalisedObject,
  fakePriceGroupDense,
  fakeRegistration,
  fakeRegistrationPriceGroup,
} from '../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../utils/testUtils';
import { SIGNUP_INITIAL_VALUES } from '../../constants';
import { SignupFormFields } from '../../types';
import TotalPrice, { TotalPriceProps } from '../TotalPrice';

configure({ defaultHidden: true });

const signups: SignupFormFields[] = [
  { ...SIGNUP_INITIAL_VALUES, priceGroup: '1' },
  { ...SIGNUP_INITIAL_VALUES, priceGroup: '2' },
];

const registrationWithPriceGroups = fakeRegistration({
  registrationPriceGroups: [
    fakeRegistrationPriceGroup({
      id: 1,
      price: '10.00',
      priceGroup: fakePriceGroupDense({
        description: fakeLocalisedObject('Price group 1'),
      }),
    }),
    fakeRegistrationPriceGroup({
      id: 2,
      price: '8.00',
      priceGroup: fakePriceGroupDense({
        description: fakeLocalisedObject('Price group 2'),
      }),
    }),
  ],
});

const defaultProps: TotalPriceProps = {
  registration: registrationWithPriceGroups,
  signups,
};

const renderComponent = (props?: Partial<TotalPriceProps>) =>
  render(<TotalPrice {...defaultProps} {...props} />);

test('should display total price of signups', async () => {
  renderComponent();

  expect(screen.getByText('Yhteensä 18,00 €')).toBeInTheDocument();
});
