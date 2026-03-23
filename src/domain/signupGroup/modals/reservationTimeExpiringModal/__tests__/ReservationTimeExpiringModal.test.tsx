import { screen, within } from '@testing-library/react';
import React from 'react';

import { render } from '../../../../../utils/testUtils';
import ReservationTimeExpiringModal from '../ReservationTimeExpiringModal';

test('uses role alert on description when timeLeft is a multiple of 10 up to 40s', () => {
  render(
    <ReservationTimeExpiringModal
      isOpen={true}
      timeLeft={40}
      onClose={vi.fn()}
    />
  );

  const dialog = screen.getByRole('dialog', {
    name: 'Varauksen aika on päättymässä',
  });
  expect(within(dialog).getByRole('alert')).toBeInTheDocument();
});

test('does not use role alert when timeLeft is outside 10s buckets in last 40s', () => {
  render(
    <ReservationTimeExpiringModal
      isOpen={true}
      timeLeft={35}
      onClose={vi.fn()}
    />
  );

  const dialog = screen.getByRole('dialog', {
    name: 'Varauksen aika on päättymässä',
  });
  expect(within(dialog).queryByRole('alert')).not.toBeInTheDocument();
});
