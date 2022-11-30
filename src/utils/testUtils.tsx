/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  act,
  createEvent,
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import React, { ReducerAction } from 'react';
import {
  Route,
  Routes,
  unstable_HistoryRouter as Router,
} from 'react-router-dom';
import wait from 'waait';

import { testIds } from '../constants';
import { createCache } from '../domain/app/apollo/apolloClient';
import { PageSettingsProvider } from '../domain/app/pageSettingsContext/PageSettingsContext';
import { ThemeProvider } from '../domain/app/theme/Theme';
import { AuthContext } from '../domain/auth/AuthContext';
import { AuthContextProps } from '../domain/auth/types';
import { authContextDefaultValue } from '../utils/mockAuthContextValue';

type CustomRenderOptions = {
  authContextValue?: AuthContextProps;
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
    authContextValue = authContextDefaultValue,
    mocks,
    routes = ['/'],
    history = createMemoryHistory({ initialEntries: routes }),
  } = {}
) => {
  const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
  }) => (
    <AuthContext.Provider value={authContextValue}>
      <PageSettingsProvider>
        <ThemeProvider>
          <MockedProvider cache={createCache()} mocks={mocks}>
            <Router history={history as any}>{children}</Router>
          </MockedProvider>
        </ThemeProvider>
      </PageSettingsProvider>
    </AuthContext.Provider>
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
    authContextValue = authContextDefaultValue,
    mocks = [],
    path = '/',
    routes = ['/'],
    history = createMemoryHistory({ initialEntries: routes }),
  } = {}
) => {
  const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
  }) => (
    <AuthContext.Provider value={authContextValue}>
      <PageSettingsProvider>
        <ThemeProvider>
          <MockedProvider cache={createCache()} mocks={mocks}>
            <Router history={history as any}>
              <Routes>
                <Route path={path} element={children} />
              </Routes>
            </Router>
          </MockedProvider>
        </ThemeProvider>
      </PageSettingsProvider>
    </AuthContext.Provider>
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

const loadingSpinnerIsNotInDocument = async (timeout = 5000): Promise<void> =>
  waitFor(
    () => {
      expect(screen.queryAllByTestId(testIds.loadingSpinner)).toHaveLength(0);
    },
    { timeout }
  );

const waitReducerToBeCalled = async (
  dispatch: jest.SpyInstance,
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

export {
  actWait,
  arrowDownKeyPressHelper,
  arrowLeftKeyPressHelper,
  arrowRightKeyPressHelper,
  arrowUpKeyPressHelper,
  createPasteEvent,
  CustomRenderOptions,
  CustomRenderResult,
  enterKeyPressHelper,
  escKeyPressHelper,
  loadingSpinnerIsNotInDocument,
  mockFile,
  mockString,
  pasteToTextEditor,
  customRender as render,
  renderWithRoute,
  tabKeyPressHelper,
  waitPageMetaDataToBeSet,
  waitReducerToBeCalled,
};

// re-export everything
export * from '@testing-library/react';
export { render as defaultRender } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
