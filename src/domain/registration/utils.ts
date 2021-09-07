import { TFunction } from 'i18next';

import { FORM_NAMES } from '../../constants';

export const clearRegistrationFormData = (): void => {
  sessionStorage.removeItem(FORM_NAMES.REGISTRATION_FORM);
};

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
