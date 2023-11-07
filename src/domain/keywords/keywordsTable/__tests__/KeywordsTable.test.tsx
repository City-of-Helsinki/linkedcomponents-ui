import React from 'react';

import { fakeKeywords } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { TEST_KEYWORD_ID } from '../../../keyword/constants';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { keywordNames, keywords } from '../../__mocks__/keywordsPage';
import { KEYWORD_SORT_OPTIONS } from '../../constants';
import KeywordsTable, { KeywordsTableProps } from '../KeywordsTable';

configure({ defaultHidden: true });

const keywordName = 'Keyword name';
const keywordId = TEST_KEYWORD_ID;

const defaultProps: KeywordsTableProps = {
  caption: 'Keywords table',
  keywords: [],
  setSort: vi.fn(),
  sort: KEYWORD_SORT_OPTIONS.NAME,
};

const mocks = [mockedOrganizationAncestorsResponse];

const renderComponent = (props?: Partial<KeywordsTableProps>) =>
  render(<KeywordsTable {...defaultProps} {...props} />, { mocks });

test('should render keywords table', async () => {
  renderComponent();

  const columnHeaders = ['ID', 'Nimi', 'Tapahtumien lkm'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should render all keywords', async () => {
  renderComponent({ keywords: keywords.data });

  for (const name of keywordNames) {
    screen.getByRole('button', { name });
  }
});

test('should open edit keyword page by clicking keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    keywords: fakeKeywords(1, [{ name: { fi: keywordName }, id: keywordId }])
      .data,
  });

  await user.click(screen.getByRole('button', { name: keywordName }));

  expect(history.location.pathname).toBe(
    `/fi/administration/keywords/edit/${keywordId}`
  );
});

test('should open edit keyword page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    keywords: fakeKeywords(1, [{ name: { fi: keywordName }, id: keywordId }])
      .data,
  });

  await user.type(screen.getByRole('button', { name: keywordName }), '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/administration/keywords/edit/${keywordId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = vi.fn();
  const user = userEvent.setup();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', {
    name: 'Nimi',
  });
  await user.click(nameButton);
  expect(setSort).toBeCalledWith('-name');

  const idButton = screen.getByRole('button', { name: 'ID' });
  await user.click(idButton);

  expect(setSort).toBeCalledWith('id');

  const nEventsButton = screen.getByRole('button', { name: 'Tapahtumien lkm' });
  await user.click(nEventsButton);

  expect(setSort).toBeCalledWith('n_events');
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({
    keywords: fakeKeywords(1, [{ name: { fi: keywordName }, id: keywordId }])
      .data,
  });

  const withinRow = within(screen.getByRole('button', { name: keywordName }));
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa avainsanaa/i,
  });

  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/keywords/edit/${keywordId}`
    )
  );
});
