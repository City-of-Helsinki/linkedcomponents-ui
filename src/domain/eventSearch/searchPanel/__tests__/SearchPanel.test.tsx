import React from 'react';

import { ROUTES } from '../../../../constants';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import SearchPanel from '../SearchPanel';

const findElement = (key: 'searchInput') => {
  switch (key) {
    case 'searchInput':
      return screen.findByRole('textbox', {
        name: translations.eventSearchPage.searchPanel.labelSearch,
      });
  }
};

const renderComponent = (route: string = ROUTES.SEARCH) =>
  render(<SearchPanel />, { routes: [route] });

test('should initialize search panel inputs', async () => {
  const searchValue = 'search';
  renderComponent(`${ROUTES.SEARCH}?text=${searchValue}`);

  const searchInput = await findElement('searchInput');
  expect(searchInput).toHaveValue(searchValue);
});

test('should search events with correct search params', async () => {
  const searchValue = 'search';
  const { history } = renderComponent();

  const searchInput = await findElement('searchInput');
  userEvent.type(searchInput, searchValue);

  const searchButton = screen.getAllByRole('button', {
    name: translations.eventSearchPage.searchPanel.buttonSearch,
  })[1];
  userEvent.click(searchButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});
