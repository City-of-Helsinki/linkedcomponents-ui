import mockAxios from 'axios';
import { toast } from 'react-toastify';

import { getMockReduxStore } from '../../../utils/testUtils';
import { store as reduxStore } from '../../app/store/store';
import { getApiToken, renewApiToken, signIn, signOut } from '../authenticate';
import { API_CLIENT_ID, API_TOKEN_ACTIONS } from '../constants';
import userManager from '../userManager';

afterEach(() => {
  jest.clearAllMocks();
});

it('should show toast error message when login fails', async () => {
  const toastError = jest.spyOn(toast, 'error');
  const error = { message: 'General error' };
  const signinRedirect = jest
    .spyOn(userManager, 'signinRedirect')
    .mockRejectedValue(error);

  await signIn();

  expect(signinRedirect).toHaveBeenCalledTimes(1);
  expect(signinRedirect).toHaveBeenCalledWith({
    data: { path: '/' },
    ui_locales: 'fi',
  });
  expect(toastError).toBeCalledWith('Tapahtui virhe. Yritä uudestaan');
});

it('should show toast error message when login fails with NetworkError', async () => {
  const toastError = jest.spyOn(toast, 'error');
  const error = { message: 'Network Error' };
  const signinRedirect = jest
    .spyOn(userManager, 'signinRedirect')
    .mockRejectedValue(error);
  const path = '/fi/events';

  await signIn(path);

  expect(signinRedirect).toHaveBeenCalledTimes(1);
  expect(signinRedirect).toHaveBeenCalledWith({
    data: { path },
    ui_locales: 'fi',
  });
  expect(toastError).toBeCalledWith(
    'Virhe kirjautumisessa: Tarkista verkkoyhteytesi ja yritä uudestaan'
  );
});

it('should get api token', async () => {
  const mockStore = getMockReduxStore();
  const accessToken = 'access-token';
  const apiToken = 'api-token';

  const axiosGet = jest
    .spyOn(mockAxios, 'get')
    .mockResolvedValue({ data: { [API_CLIENT_ID]: apiToken } });

  await mockStore.dispatch(getApiToken(accessToken));

  expect(axiosGet).toHaveBeenCalledTimes(1);
  expect(axiosGet).toHaveBeenCalledWith(
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

it('should renew api token', async () => {
  const mockStore = getMockReduxStore();
  const accessToken = 'access-token';
  const apiToken = 'api-token';

  const axiosGet = jest
    .spyOn(mockAxios, 'get')
    .mockResolvedValue({ data: { [API_CLIENT_ID]: apiToken } });

  await mockStore.dispatch(getApiToken(accessToken));

  expect(axiosGet).toHaveBeenCalledTimes(1);
  expect(axiosGet).toHaveBeenCalledWith(
    `${process.env.REACT_APP_OIDC_AUTHORITY}/api-tokens/`,
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

  const expectedActions = [
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
  const toastError = jest.spyOn(toast, 'error');
  const mockStore = getMockReduxStore();
  const accessToken = 'access-token';
  const error = 'error';

  const axiosGet = jest.spyOn(mockAxios, 'get').mockRejectedValue(error);

  await mockStore.dispatch(getApiToken(accessToken));

  expect(axiosGet).toHaveBeenCalledTimes(1);
  expect(axiosGet).toHaveBeenCalledWith(
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

  expect(toastError).toBeCalledWith('Tapahtui virhe. Yritä uudestaan');
});

it('should show toast error message when failing to renew api token', async () => {
  const toastError = jest.spyOn(toast, 'error');
  const mockStore = getMockReduxStore();
  const accessToken = 'access-token';
  const error = 'error';

  const axiosGet = jest.spyOn(mockAxios, 'get').mockRejectedValue(error);

  await mockStore.dispatch(renewApiToken(accessToken));

  expect(axiosGet).toHaveBeenCalledTimes(1);
  expect(axiosGet).toHaveBeenCalledWith(
    `${process.env.REACT_APP_OIDC_AUTHORITY}/api-tokens/`,
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

  const expectedActions = [
    {
      type: API_TOKEN_ACTIONS.FETCH_TOKEN_ERROR,
      payload: error,
    },
  ];
  const actions = mockStore.getActions();

  expectedActions.forEach((action) => {
    expect(actions).toContainEqual(action);
  });

  expect(toastError).toBeCalledWith('Tapahtui virhe. Yritä uudestaan');
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
