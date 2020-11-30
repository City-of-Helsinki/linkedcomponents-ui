import mockAxios from 'axios';
import { toast } from 'react-toastify';

import { getMockReduxStore } from '../../../utils/testUtils';
import { store as reduxStore } from '../../app/store/store';
import { getApiToken, signIn, signOut } from '../authenticate';
import { API_CLIENT_ID, API_TOKEN_ACTIONS } from '../constants';
import userManager from '../userManager';

afterEach(() => {
  jest.clearAllMocks();
});

it('should show toast error message when login fails', async () => {
  toast.error = jest.fn();
  const error = { message: 'General error' };

  userManager.signinRedirect = jest.fn();
  (userManager.signinRedirect as jest.Mock).mockImplementationOnce(() =>
    Promise.reject({ ...error })
  );

  await signIn();

  expect(userManager.signinRedirect).toHaveBeenCalledTimes(1);
  expect(userManager.signinRedirect).toHaveBeenCalledWith({
    data: { path: '/' },
    // eslint-disable-next-line @typescript-eslint/camelcase
    ui_locales: 'fi',
  });
  expect(toast.error).toBeCalledWith('Tapahtui virhe. Yritä uudestaan');
});

it('should show toast error message when login fails with NetworkError', async () => {
  toast.error = jest.fn();
  const error = { message: 'Network Error' };
  const path = '/fi/events';

  userManager.signinRedirect = jest.fn();
  (userManager.signinRedirect as jest.Mock).mockImplementationOnce(() =>
    Promise.reject({ ...error })
  );

  await signIn(path);

  expect(userManager.signinRedirect).toHaveBeenCalledTimes(1);
  expect(userManager.signinRedirect).toHaveBeenCalledWith({
    data: { path },
    // eslint-disable-next-line @typescript-eslint/camelcase
    ui_locales: 'fi',
  });
  expect(toast.error).toBeCalledWith(
    'Virhe kirjautumisessa: Tarkista verkkoyhteytesi ja yritä uudestaan'
  );
});

it('should get api token', async () => {
  const mockStore = getMockReduxStore();
  const accessToken = 'access-token';
  const apiToken = 'api-token';

  mockAxios.get = jest.fn();
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({ data: { [API_CLIENT_ID]: apiToken } })
  );

  await mockStore.dispatch(getApiToken(accessToken));

  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(
    `${process.env.REACT_APP_OIDC_AUTHORITY}/api-tokens/`,
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

  const expectedActions = [
    { type: API_TOKEN_ACTIONS.START_FETCHING_TOKEN, payload: undefined },
    {
      type: API_TOKEN_ACTIONS.FETCH_TOKEN_SUCCESS,
      payload: { [API_CLIENT_ID]: apiToken },
    },
  ];
  const actions = mockStore.getActions();

  expectedActions.forEach((action) => {
    expect(actions).toContainEqual(action);
  });
});

it('should show toast error message when failing to get api token', async () => {
  toast.error = jest.fn();
  const mockStore = getMockReduxStore();
  const accessToken = 'access-token';
  const error = 'error';

  mockAxios.get = jest.fn();
  (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
    Promise.reject(error)
  );

  await mockStore.dispatch(getApiToken(accessToken));

  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(
    `${process.env.REACT_APP_OIDC_AUTHORITY}/api-tokens/`,
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

  const expectedActions = [
    { type: API_TOKEN_ACTIONS.START_FETCHING_TOKEN, payload: undefined },
    {
      type: API_TOKEN_ACTIONS.FETCH_TOKEN_ERROR,
      payload: error,
    },
  ];
  const actions = mockStore.getActions();

  expectedActions.forEach((action) => {
    expect(actions).toContainEqual(action);
  });

  expect(toast.error).toBeCalled();
});

it('should clear redux store and session storage when signing out ', () => {
  const dispatch = jest.fn();
  reduxStore.dispatch = dispatch;

  signOut();

  expect(dispatch).toBeCalledWith({
    payload: undefined,
    type: API_TOKEN_ACTIONS.RESET_API_TOKEN_DATA,
  });
  expect(sessionStorage.clear).toHaveBeenCalled();
});
