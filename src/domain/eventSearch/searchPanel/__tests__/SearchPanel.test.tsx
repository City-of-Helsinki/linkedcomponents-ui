import React from 'react';

import { mockedPlacesResponse } from '../../__mocks__/eventSearchPage';
import { ROUTES } from '../../../../constants';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import SearchPanel from '../SearchPanel';

const mocks = [mockedPlacesResponse];

const findElement = (
  key: 'dateSelectorButton' | 'endDateInput' | 'searchInput' | 'startDateInput'
) => {
  switch (key) {
    case 'dateSelectorButton':
      return screen.findByRole('button', {
        name: translations.common.dateSelector.buttonToggle,
      });
    case 'endDateInput':
      return screen.findByPlaceholderText(
        translations.common.dateSelector.placeholderEndDate
      );
    case 'searchInput':
      return screen.findByRole('searchbox', {
        name: translations.eventSearchPage.searchPanel.labelSearch,
      });
    case 'startDateInput':
      return screen.findByPlaceholderText(
        translations.common.dateSelector.placeholderStartDate
      );
  }
};

const renderComponent = (route: string = ROUTES.SEARCH) =>
  render(<SearchPanel />, { mocks, routes: [route] });

test('should initialize search panel inputs', async () => {
  const searchValue = 'search';
  renderComponent(`${ROUTES.SEARCH}?text=${searchValue}`);

  const searchInput = await findElement('searchInput');
  expect(searchInput).toHaveValue(searchValue);
});

test('should search events with correct search params', async () => {
  const values = {
    endDate: '12.03.2021',
    startDate: '05.03.2021',
    text: 'search',
  };

  const { history } = renderComponent();

  const searchInput = await findElement('searchInput');
  userEvent.type(searchInput, values.text);

  const dateSelectorButton = await findElement('dateSelectorButton');
  userEvent.click(dateSelectorButton);

  const startDateInput = await findElement('startDateInput');
  userEvent.click(startDateInput);
  userEvent.type(startDateInput, values.startDate);
  await waitFor(() => {
    expect(startDateInput).toHaveValue(values.startDate);
  });

  const endDateInput = await findElement('endDateInput');
  userEvent.click(endDateInput);
  userEvent.type(endDateInput, values.endDate);
  await waitFor(() => {
    expect(endDateInput).toHaveValue(values.endDate);
  });

  const searchButton = screen.getAllByRole('button', {
    name: translations.eventSearchPage.searchPanel.buttonSearch,
  })[1];
  userEvent.click(searchButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(
    `?text=${values.text}&end=2021-03-12&start=2021-03-05`
  );
});
