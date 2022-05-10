import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import Hero from '../Hero';

configure({ defaultHidden: true });

const getElement = (
  key:
    | 'buttonCreate'
    | 'buttonSearch1'
    | 'buttonSearch2'
    | 'searchInput'
    | 'title'
) => {
  switch (key) {
    case 'buttonCreate':
      return screen.getByRole('button', { name: /lisää tekemistä/i });
    case 'buttonSearch1':
      return screen.getAllByRole('button', { name: /etsi tapahtumia/i })[0];
    case 'buttonSearch2':
      return screen.getAllByRole('button', { name: /etsi tapahtumia/i })[1];
    case 'searchInput':
      return screen.getByRole('searchbox', {
        name: 'Hae Linked Events -rajapinnasta',
      });
    case 'title':
      return screen.getByRole('heading', {
        name: 'Helsingin tapahtumat ja harrastukset',
      });
  }
};

test('should render hero', () => {
  render(<Hero />);

  getElement('buttonCreate');
  getElement('title');
  getElement('searchInput');
  getElement('buttonSearch1');
  getElement('buttonSearch2');
});

test('should route to create new page', async () => {
  const user = userEvent.setup();
  const { history } = render(<Hero />);

  const createButton = getElement('buttonCreate');
  await act(async () => await user.click(createButton));

  expect(history.location.pathname).toBe('/fi/events/create');
});

test('should route to search page when click button inside search input', async () => {
  const searchValue = 'search';

  const user = userEvent.setup();
  const { history } = render(<Hero />);

  const searchInput = getElement('searchInput');
  await act(async () => await user.type(searchInput, searchValue));

  const searchButton = getElement('buttonSearch1');
  await act(async () => await user.click(searchButton));

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});

test('should route to search page when click search button', async () => {
  const searchValue = 'search';

  const user = userEvent.setup();
  const { history } = render(<Hero />);

  const searchInput = getElement('searchInput');
  await act(async () => await user.type(searchInput, searchValue));

  const searchButton = getElement('buttonSearch2');
  await act(async () => await user.click(searchButton));

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe(`?text=${searchValue}`);
});
