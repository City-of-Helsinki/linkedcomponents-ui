/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/export */
import { ApolloError } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  act,
  createEvent,
  fireEvent,
  render,
  RenderHookResult,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import React, { ReducerAction } from 'react';
import { Route, Routes, unstable_HistoryRouter as Router } from 'react-router';
import { Mock, MockInstance } from 'vitest';
import wait from 'waait';

import { AccessibilityNotificationProvider } from '../common/components/accessibilityNotificationContext/AccessibilityNotificationContext';
import { testIds } from '../constants';
import { createCache } from '../domain/app/apollo/apolloClient';
import { NotificationsProvider } from '../domain/app/notificationsContext/NotificationsContext';
import { PageSettingsProvider } from '../domain/app/pageSettingsContext/PageSettingsContext';
import { ThemeProvider } from '../domain/app/theme/Theme';
import { ServerErrorItem, UseServerErrorsState } from '../types';

type CustomRenderOptions = {
  history?: History;
  mocks?: MockedResponse[];
  path?: string;
  routes?: string[];
};

type CustomRender = {
  (ui: React.ReactElement, options?: CustomRenderOptions): CustomRenderResult;
};

type CustomRenderResult = RenderResult & { history: History };

const arrowUpKeyPressHelper = (el?: HTMLElement): boolean =>
  fireEvent.keyDown(el || document, { code: 38, key: 'ArrowUp' });

const arrowDownKeyPressHelper = (el?: HTMLElement): boolean =>
  fireEvent.keyDown(el || document, { code: 40, key: 'ArrowDown' });

const arrowLeftKeyPressHelper = (el?: HTMLElement): boolean =>
  fireEvent.keyDown(el || document, { code: 38, key: 'ArrowLeft' });

const arrowRightKeyPressHelper = (el?: HTMLElement): boolean =>
  fireEvent.keyDown(el || document, { code: 38, key: 'ArrowRight' });

const enterKeyPressHelper = (el?: HTMLElement): boolean =>
  fireEvent.keyDown(el || document, { code: 13, key: 'Enter' });

const escKeyPressHelper = (el?: HTMLElement): boolean =>
  fireEvent.keyDown(el || document, { code: 27, key: 'Escape' });

const tabKeyPressHelper = (el?: HTMLElement): boolean =>
  fireEvent.keyDown(el || document, { code: 9, key: 'Tab' });

const customRender: CustomRender = (
  ui,
  {
    mocks,
    routes = ['/'],
    history = createMemoryHistory({ initialEntries: routes }),
  } = {}
) => {
  const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
  }) => (
    <ThemeProvider>
      <AccessibilityNotificationProvider>
        <NotificationsProvider>
          <PageSettingsProvider>
            <MockedProvider cache={createCache()} mocks={mocks}>
              <Router history={history as any}>{children}</Router>
            </MockedProvider>
          </PageSettingsProvider>
        </NotificationsProvider>
      </AccessibilityNotificationProvider>
    </ThemeProvider>
  );

  const renderResult = render(ui, { wrapper: Wrapper as any });
  return { ...renderResult, history };
};

const actWait = (amount?: number): Promise<void> => act(() => wait(amount));

const mockNumberString = (size: number): string =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 10).toString())
    .join('');

const mockString = (size: number): string =>
  [...Array(size)].map(() => Math.random().toString(36)[2]).join('');

type MockFileArgs = {
  name?: string;
  size?: number;
  type?: string;
};

const mockFile = ({
  name = 'testfile.png',
  size = 0,
  type = 'image/png',
}: MockFileArgs): File => {
  const content = mockString(size);

  return new File([content], name, {
    type,
  });
};

const renderWithRoute: CustomRender = (
  ui,
  {
    mocks = [],
    path = '/',
    routes = ['/'],
    history = createMemoryHistory({ initialEntries: routes }),
  } = {}
) => {
  const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
  }) => (
    <ThemeProvider>
      <AccessibilityNotificationProvider>
        <NotificationsProvider>
          <PageSettingsProvider>
            <MockedProvider cache={createCache()} mocks={mocks}>
              <Router history={history as any}>
                <Routes>
                  <Route path={path} element={children} />
                </Routes>
              </Router>
            </MockedProvider>
          </PageSettingsProvider>
        </NotificationsProvider>
      </AccessibilityNotificationProvider>
    </ThemeProvider>
  );

  const renderResult = render(ui, { wrapper: Wrapper as any });
  return { ...renderResult, history };
};

type PasteEvent = {
  clipboardData: {
    types: string[];
    getData: (type: string) => string;
  };
};

const createPasteEvent = (html: string): PasteEvent => {
  const text = html.replace('<[^>]*>', '');
  return {
    clipboardData: {
      types: ['text/plain', 'text/html'],
      getData: (type) => (type === 'text/plain' ? text : html),
    },
  };
};

const pasteToTextEditor = (
  editor: Element | Node | Document | Window,
  text: string
): void => {
  const eventProperties = createPasteEvent(text);
  const pasteEvent = createEvent.paste(editor, eventProperties);
  fireEvent(editor, pasteEvent);
};

const loadingSpinnerIsNotInDocument = async (timeout = 5000): Promise<void> => {
  await waitFor(
    () => {
      expect(screen.queryAllByTestId(testIds.loadingSpinner)).toHaveLength(0);
    },
    { timeout }
  );
  await waitFor(
    () => {
      expect(screen.queryAllByText('Lataaminen päättynyt')).toHaveLength(0);
    },
    { timeout }
  );
};

const waitReducerToBeCalled = async (
  dispatch: MockInstance,
  action: ReducerAction<any>
) => await waitFor(() => expect(dispatch).toBeCalledWith(action));

const waitPageMetaDataToBeSet = async ({
  pageDescription,
  pageKeywords,
  pageTitle,
}: {
  pageDescription: string;
  pageKeywords: string;
  pageTitle: string;
}) => {
  await waitFor(() => expect(document.title).toEqual(pageTitle));

  const head = document.querySelector('head');
  const description = head?.querySelector('[name="description"]');
  const keywords = head?.querySelector('[name="keywords"]');
  const ogTitle = head?.querySelector('[property="og:title"]');
  const ogDescription = head?.querySelector('[property="og:description"]');

  expect(ogTitle).toHaveAttribute('content', pageTitle);
  expect(description).toHaveAttribute('content', pageDescription);
  expect(keywords).toHaveAttribute('content', pageKeywords);
  expect(ogDescription).toHaveAttribute('content', pageDescription);
};

// Dropdown menu helpers
const openDropdownMenu = async (label: string | RegExp = /valinnat/i) => {
  const user = userEvent.setup();
  const toggleButton = await screen.findByRole('button', { name: label });
  await user.click(toggleButton);
  const menu = screen.getByRole('region', { name: label });

  return { menu, toggleButton };
};

const shouldToggleDropdownMenu = async (
  toggleButtonLabel: string | RegExp = /valinnat/i
) => {
  const user = userEvent.setup();
  const { toggleButton } = await openDropdownMenu(toggleButtonLabel);
  await user.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
};

const shouldOpenMenuAndSelectOption = async ({
  optionLabels,
  toggleButtonLabel,
}: {
  optionLabels: string[];
  toggleButtonLabel: RegExp | string;
}) => {
  const user = userEvent.setup();

  const toggleButton = screen.getByRole('button', { name: toggleButtonLabel });

  await user.click(toggleButton);

  await screen.findByRole('option', { hidden: true, name: optionLabels[0] });

  optionLabels.forEach((name) =>
    expect(
      screen.getByRole('option', { hidden: true, name })
    ).toBeInTheDocument()
  );
};

// Modal helpers
const shouldRenderDeleteModal = ({
  confirmButtonLabel,
  heading,
  text,
}: {
  confirmButtonLabel: string | RegExp;
  heading: string | RegExp;
  text: string | RegExp;
}) => {
  expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  expect(screen.getByText('Varoitus!')).toBeInTheDocument();
  expect(screen.getByText(text)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Peruuta' })).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: confirmButtonLabel })
  ).toBeInTheDocument();
};

const shouldClickButton = async ({
  buttonLabel,
  onClick,
}: {
  buttonLabel: string | RegExp;
  onClick: Mock;
}) => {
  const user = userEvent.setup();

  const button = screen.getByRole('button', { name: buttonLabel });
  await user.click(button);
  expect(onClick).toBeCalled();
};

// Server error helpers
const shouldSetGenericServerErrors = (
  result: RenderHookResult<UseServerErrorsState, any>['result']
) => {
  const error = new ApolloError({
    networkError: {
      result: { detail: 'Metodi "POST" ei ole sallittu.' },
    } as any,
  });

  act(() => result.current.showServerErrors({ error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: '', message: 'Metodi "POST" ei ole sallittu.' },
  ]);
};

const shouldSetServerErrors = (
  result: RenderHookResult<UseServerErrorsState, any>['result'],
  errors: Record<string, any>,
  expectedErrors: ServerErrorItem[]
) => {
  const callbackFn = vi.fn();
  const error = new ApolloError({
    networkError: { result: errors } as any,
  });

  act(() => result.current.showServerErrors({ callbackFn, error }));

  expect(result.current.serverErrorItems).toEqual(expectedErrors);
  expect(callbackFn).toBeCalled();
};

// List pages
const shouldRenderListPage = async ({
  createButtonLabel,
  heading,
  searchInputLabel,
  tableCaption,
}: {
  createButtonLabel: string | RegExp;
  heading: string | RegExp;
  searchInputLabel: string | RegExp;
  tableCaption: string | RegExp;
}) => {
  await screen.findByRole('heading', { name: heading });
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('navigation', { name: 'Murupolku' })
  ).toBeInTheDocument();

  if (createButtonLabel) {
    expect(
      screen.getByRole('button', { name: createButtonLabel })
    ).toBeInTheDocument();
  }

  expect(
    screen.getByRole('textbox', { name: searchInputLabel })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('table', {
      name: tableCaption,
    })
  );
};

const shouldClickListPageCreateButton = async ({
  createButtonLabel,
  expectedPathname,
  history,
}: {
  createButtonLabel: string | RegExp;
  expectedPathname: string;
  history: History;
}) => {
  const user = userEvent.setup();
  await loadingSpinnerIsNotInDocument(10000);

  const createEventButton = screen.getByRole('button', {
    name: createButtonLabel,
  });
  await user.click(createEventButton);

  expect(history.location.pathname).toBe(expectedPathname);
};

const shouldSortListPageTable = async ({
  dataTestId,
  expectedSearch,
  history,
}: {
  dataTestId: string;
  expectedSearch: string;
  history: History;
}) => {
  const user = userEvent.setup();
  await loadingSpinnerIsNotInDocument();

  const sortButton = screen.getByTestId(dataTestId);
  await user.click(sortButton);

  expect(history.location.search).toBe(expectedSearch);
};

// Edit pages
const shouldApplyExpectedMetaData = async ({
  expectedDescription,
  expectedKeywords,
  expectedTitle,
}: {
  expectedDescription: string;
  expectedKeywords: string;
  expectedTitle: string;
}) => {
  await loadingSpinnerIsNotInDocument();
  await waitPageMetaDataToBeSet({
    pageDescription: expectedDescription,
    pageKeywords: expectedKeywords,
    pageTitle: expectedTitle,
  });
  await actWait(10);
};

const shouldDeleteInstance = async ({
  dialogName,
  confirmDeleteButtonLabel,
  deleteButtonLabel,
  expectedNotificationText,
  expectedUrl,
  history,
}: {
  dialogName?: string | RegExp;
  confirmDeleteButtonLabel: string | RegExp;
  deleteButtonLabel: string | RegExp;
  expectedNotificationText: string;
  expectedUrl: string;
  history: History;
}) => {
  const user = userEvent.setup();
  await loadingSpinnerIsNotInDocument();

  const deleteButton = await screen.findByRole('button', {
    name: deleteButtonLabel,
  });
  await user.click(deleteButton);

  await waitFor(() => screen.getByRole('dialog', { name: dialogName }));

  const withinModal = within(screen.getByRole('dialog', { name: dialogName }));
  const confirmDeleteButton = withinModal.getByRole('button', {
    name: confirmDeleteButtonLabel,
  });
  await user.click(confirmDeleteButton);
  await waitFor(() => expect(history.location.pathname).toBe(expectedUrl));
  await screen.findByRole('alert', { name: expectedNotificationText });
};

const shouldDisplayAndRemoveFilter = async ({
  deleteButtonLabel,
  expectedPathname,
  history,
}: {
  deleteButtonLabel: string | RegExp;
  expectedPathname: string;
  history: History;
}) => {
  const user = userEvent.setup();

  const deleteFilterButton = await screen.findByRole('button', {
    name: deleteButtonLabel,
  });
  await user.click(deleteFilterButton);

  expect(history.location.pathname).toBe(expectedPathname);
  expect(history.location.search).toBe('');
};

const shouldFilterEventsOrRegistrations = async ({
  expectedPathname,
  expectedSearch,
  history,
  searchButtonLabel,
  searchInputLabel,
  values,
}: {
  expectedPathname: string;
  expectedSearch: string;
  history: History;
  searchButtonLabel: string;
  searchInputLabel: string;
  values: { publisher: string; text: string };
}) => {
  const user = userEvent.setup();

  // Text filtering
  const searchInput = screen.getByRole('textbox', {
    name: searchInputLabel,
  });
  fireEvent.change(searchInput, { target: { value: values.text } });

  // Event type filtering
  const eventTypeSelectorButton = screen.getByRole('button', {
    name: 'Tyyppi',
  });
  await user.click(eventTypeSelectorButton);
  const eventTypeCheckbox = screen.getByRole('checkbox', {
    name: /tapahtuma/i,
  });
  await user.click(eventTypeCheckbox);

  // Publisher filtering
  const publisherSelectorButton = screen.getByRole('button', {
    name: 'Etsi julkaisijaa',
  });
  await user.click(publisherSelectorButton);
  const publisherCheckbox = screen.getByLabelText(values.publisher);
  await user.click(publisherCheckbox);

  const searchButton = screen.getAllByRole('button', {
    name: searchButtonLabel,
  })[1];
  await user.click(searchButton);

  expect(history.location.pathname).toBe(expectedPathname);
  expect(history.location.search).toBe(expectedSearch);
};

// re-export everything
export * from '@testing-library/react';
export { render as defaultRender } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export type { CustomRenderOptions, CustomRenderResult };

export {
  actWait,
  arrowDownKeyPressHelper,
  arrowLeftKeyPressHelper,
  arrowRightKeyPressHelper,
  arrowUpKeyPressHelper,
  createPasteEvent,
  enterKeyPressHelper,
  escKeyPressHelper,
  loadingSpinnerIsNotInDocument,
  mockFile,
  mockNumberString,
  mockString,
  openDropdownMenu,
  pasteToTextEditor,
  customRender as render,
  renderWithRoute,
  shouldApplyExpectedMetaData,
  shouldClickButton,
  shouldClickListPageCreateButton,
  shouldDeleteInstance,
  shouldDisplayAndRemoveFilter,
  shouldFilterEventsOrRegistrations,
  shouldOpenMenuAndSelectOption,
  shouldRenderDeleteModal,
  shouldRenderListPage,
  shouldSetGenericServerErrors,
  shouldSetServerErrors,
  shouldSortListPageTable,
  shouldToggleDropdownMenu,
  tabKeyPressHelper,
  waitPageMetaDataToBeSet,
  waitReducerToBeCalled,
};
