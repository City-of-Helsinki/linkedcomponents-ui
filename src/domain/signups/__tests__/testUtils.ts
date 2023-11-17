/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { userEvent, waitFor } from '../../../utils/testUtils';
import { setApiTokenToStorage } from '../../auth/utils';

export const shouldExportSignupsAsExcel = async ({
  exportAsExcelButton,
  registration,
}: {
  exportAsExcelButton: HTMLElement;
  registration: RegistrationFieldsFragment;
}) => {
  const user = userEvent.setup();

  setApiTokenToStorage('api-token');
  global.fetch = vi.fn(() =>
    Promise.resolve({ blob: () => Promise.resolve({}), status: 200 })
  ) as any;
  const link: any = { click: vi.fn(), remove: vi.fn() };
  global.URL.createObjectURL = vi.fn(() => 'https://test.com');
  global.URL.revokeObjectURL = vi.fn();

  const createElement = document.createElement;
  document.createElement = vi.fn().mockImplementation(() => link);

  await user.click(exportAsExcelButton);

  await waitFor(() =>
    expect(link.download).toBe(`registered_persons_${registration.id}`)
  );
  expect(link.href).toBe('https://test.com');
  expect(link.click).toHaveBeenCalledTimes(1);
  // Restore original createElement to avoid unexpected side effects
  document.createElement = createElement;
};
