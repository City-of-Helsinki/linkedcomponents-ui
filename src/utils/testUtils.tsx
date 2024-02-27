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
import {
  Route,
  Routes,
  unstable_HistoryRouter as Router,
} from 'react-router-dom';
import { Mock, SpyInstance } from 'vitest';
import wait from 'waait';

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
      <NotificationsProvider>
        <PageSettingsProvider>
          <MockedProvider cache={createCache()} mocks={mocks}>
            <Router history={history as any}>{children}</Router>
          </MockedProvider>
        </PageSettingsProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );

  const renderResult = render(ui, { wrapper: Wrapper as any });
  return { ...renderResult, history };
};

const actWait = (amount?: number): Promise<void> => act(() => wait(amount));

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
  dispatch: SpyInstance,
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
  const toggleButton = screen.getByRole('button', { name: label });
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

// Modal helpers
const shouldCallModalButtonAction = async (
  buttonLabel: string | RegExp,
  onClick: Mock
) => {
  const user = userEvent.setup();
  const button = screen.getByRole('button', { name: buttonLabel });
  await user.click(button);
  expect(onClick).toBeCalled();
};

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
  confirmDeleteButtonLabel,
  deleteButtonLabel,
  expectedNotificationText,
  expectedUrl,
  history,
}: {
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
  const withinModal = within(screen.getByRole('dialog'));
  const confirmDeleteButton = withinModal.getByRole('button', {
    name: confirmDeleteButtonLabel,
  });
  await user.click(confirmDeleteButton);
  await waitFor(() => expect(history.location.pathname).toBe(expectedUrl));
  await screen.findByRole('alert', { name: expectedNotificationText });
};

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
  mockString,
  openDropdownMenu,
  pasteToTextEditor,
  customRender as render,
  renderWithRoute,
  shouldApplyExpectedMetaData,
  shouldCallModalButtonAction,
  shouldDeleteInstance,
  shouldRenderDeleteModal,
  shouldSetGenericServerErrors,
  shouldSetServerErrors,
  shouldToggleDropdownMenu,
  tabKeyPressHelper,
  waitPageMetaDataToBeSet,
  waitReducerToBeCalled,
};

// re-export everything
export * from '@testing-library/react';
export { render as defaultRender } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
