import { act, render, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Mock, vi } from 'vitest';

import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import useAuth from '../useAuth';

const mockUseLocation = vi
  .fn()
  .mockReturnValue({ pathname: '/test', search: '?query=1' });

vi.mock('react-router', () => ({
  useLocation: vi.fn(),
}));

const TestComponent: React.FC = () => {
  const auth = useAuth();

  useEffect(() => {
    auth.login('/signInPath');
    auth.logout();
  }, [auth]);

  return (
    <div>
      <div data-testid="authenticated">{auth.authenticated.toString()}</div>
      <div data-testid="isRenewing">{auth.isRenewing.toString()}</div>
      <div data-testid="apiToken">{auth.apiToken}</div>
      <div data-testid="user">{auth.user?.profile.sub}</div>
      <button onClick={() => auth.login('/signInPath')} data-testid="login">
        Login
      </button>
      <button onClick={() => auth.logout()} data-testid="logout">
        Logout
      </button>
    </div>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    (useLocation as Mock).mockReturnValue(mockUseLocation);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state correctly', async () => {
    mockAuthenticatedLoginState();

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('authenticated').textContent).toBe('true');
    expect(getByTestId('isRenewing').textContent).toBe('false');
    expect(getByTestId('apiToken').textContent).toBe('api-token');
    expect(getByTestId('user').textContent).toBe('user:1');
  });

  it('should handle login correctly', async () => {
    const mockLogin = vi.fn();

    mockAuthenticatedLoginState({ login: mockLogin });

    const { getByTestId } = render(<TestComponent />);

    await act(async () => {
      getByTestId('login').click();
    });

    expect(mockLogin).toHaveBeenCalledWith({
      language: 'fi',
      state: { path: '/signInPath' },
    });
  });

  it('should handle logout correctly', async () => {
    const mockLogout = vi.fn();

    mockAuthenticatedLoginState({ logout: mockLogout });

    const { getByTestId } = render(<TestComponent />);

    await act(async () => {
      getByTestId('logout').click();
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('should fetch new API token if tokens are renewing or error occurred', async () => {
    mockAuthenticatedLoginState({ isRenewing: true, apiToken: undefined });

    const { getByTestId } = render(<TestComponent />);

    await waitFor(() =>
      expect(getByTestId('apiToken').textContent).toBe('renewed-api-token')
    );
  });
});
