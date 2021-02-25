import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import DateFilterTag, { DateFilterTagProps } from '../DateFilterTag';

const end = new Date('2021-10-13');
const start = new Date('2021-10-05');

const defaultProps: DateFilterTagProps = {
  end,
  onDelete: jest.fn(),
  start,
};

const renderComponent = (props?: Partial<DateFilterTagProps>) =>
  render(<DateFilterTag {...defaultProps} {...props} />);

test('should render date filter when start and end date are defined', async () => {
  renderComponent();

  screen.getByRole('button', {
    name: `Poista suodatusehto: 05.10.2021 - 13.10.2021`,
  });
});

test('should render date filter when only start date is defined', async () => {
  renderComponent({ end: null });

  screen.getByRole('button', {
    name: `Poista suodatusehto: 05.10.2021 -`,
  });
});

test('should render date filter when only end date is defined', async () => {
  renderComponent({ start: null });

  screen.getByRole('button', {
    name: `Poista suodatusehto: - 13.10.2021`,
  });
});

test('should render date filter neither end or start date are defined', async () => {
  renderComponent({ end: null, start: null });

  screen.getByRole('button', {
    name: `Poista suodatusehto:`,
  });
});
