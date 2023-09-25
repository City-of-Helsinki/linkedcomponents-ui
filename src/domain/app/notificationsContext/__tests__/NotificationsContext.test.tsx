import { configure, render, screen } from '@testing-library/react';
import React, { useEffect } from 'react';

import { ThemeProvider } from '../../theme/Theme';
import { useNotificationsContext } from '../hooks/useNotificationsContext';
import { NotificationsProvider } from '../NotificationsContext';

configure({ defaultHidden: true });

it('should show several notifications', async () => {
  const Component = () => {
    const { addNotification } = useNotificationsContext();

    useEffect(() => {
      addNotification({ label: 'Notification 1', type: 'success' });
      addNotification({ label: 'Notification 2', type: 'error' });
      addNotification({ label: 'Notification 3', type: 'info' });
    });
    return null;
  };

  render(
    <ThemeProvider>
      <NotificationsProvider>
        <Component />
      </NotificationsProvider>
    </ThemeProvider>
  );

  await screen.findByRole('alert', { name: 'Notification 1' });
  await screen.findByRole('alert', { name: 'Notification 2' });
  await screen.findByRole('alert', { name: 'Notification 3' });
});
