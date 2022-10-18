/* eslint-disable @typescript-eslint/no-explicit-any */
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { configure, render } from '../../../../utils/testUtils';
import { registration } from '../../../registration/__mocks__/registration';
import ReservationTimer from '../ReservationTimer';

configure({ defaultHidden: true });

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

afterAll(() => {
  clear();
});

const renderComponent = () =>
  render(<ReservationTimer registration={registration} />);

test('should store reservation info to session storage if reservation is saved', async () => {
  advanceTo('2021-12-12');
  (sessionStorage.getItem as jest.Mock).mockReturnValueOnce(
    JSON.stringify(null)
  );

  renderComponent();
  expect(sessionStorage.setItem).toBeCalledWith(
    'enrolment-reservation-registration:1',
    '{"expires":1639269000,"participants":1,"session":"","started":1639267200}'
  );
});

test('should store reservation info to session storage if reservation is expired', async () => {
  advanceTo('2021-12-12');
  (sessionStorage.getItem as jest.Mock).mockReturnValueOnce(
    JSON.stringify({ expires: 100 })
  );

  renderComponent();
  expect(sessionStorage.setItem).toBeCalledWith(
    'enrolment-reservation-registration:1',
    '{"expires":1639269000,"participants":1,"session":"","started":1639267200}'
  );
});

test('should not store reservation info to session storage if reservation is not expired', async () => {
  advanceTo('2021-12-12');
  (sessionStorage.getItem as jest.Mock).mockReturnValueOnce(
    JSON.stringify({ expires: 1639369000 })
  );

  renderComponent();
  expect(sessionStorage.setItem).not.toBeCalled();
});
