import { TFunction } from 'i18next';

// TODO: Check also user organizations when API is available
export const isCreateRegistrationButtonDisabled = ({
  authenticated,
}: {
  authenticated: boolean;
}): boolean => {
  return !authenticated;
};

// TODO: Check also user organizations when API is available
export const getCreateRegistrationButtonWarning = ({
  authenticated,
  t,
}: {
  authenticated: boolean;
  t: TFunction;
}): string => {
  if (!authenticated) {
    return t('registration.form.buttonPanel.warningNotAuthenticated');
  }

  return '';
};
