import React from 'react';

import { render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import Hero from '../Hero';

test('should render hero', async () => {
  render(<Hero />);

  await screen.findByRole('heading', {
    name: translations.landingPage.heroTitle,
  });
  await screen.findByRole('textbox', {
    name: translations.eventSearchPage.searchPanel.labelSearch,
  });

  expect(
    screen.getAllByRole('button', {
      name: translations.eventSearchPage.searchPanel.buttonSearch,
    })
  ).toHaveLength(2);
});

test('should route to search page when click button inside search input', async () => {
  const searchValue = 'search';

  const { history } = render(<Hero />);

  const searchInput = await screen.findByRole('textbox', {
    name: translations.eventSearchPage.searchPanel.labelSearch,
  });
  userEvent.type(searchInput, searchValue);

  const searchButton = screen.getAllByRole('button', {
    name: translations.eventSearchPage.searchPanel.buttonSearch,
  })[0];
  userEvent.click(searchButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});

test('should route to search page when click search button', async () => {
  const searchValue = 'search';

  const { history } = render(<Hero />);

  const searchInput = await screen.findByRole('textbox', {
    name: translations.eventSearchPage.searchPanel.labelSearch,
  });
  userEvent.type(searchInput, searchValue);

  const searchButton = screen.getAllByRole('button', {
    name: translations.eventSearchPage.searchPanel.buttonSearch,
  })[1];
  userEvent.click(searchButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});
