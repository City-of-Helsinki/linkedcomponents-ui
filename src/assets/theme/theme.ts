import { Theme } from '../../domain/app/theme/Theme';

const commonButtonVariables = {
  '--focus-outline-color': 'var(--color-coat-of-arms-blue)',
  '--submit-input-focus-gutter-color': 'var(--color-white)',
};

const secondaryAndSumplementaryButtonVariables = {
  '--background-color': 'transparent',
  '--background-color-hover': 'var(--color-bus-light-5)',
  '--background-color-focus': 'transparent',
  '--background-color-hover-focus': 'var(--color-bus-light-5)',
  '--background-color-disabled': 'transparent',
  '--color': 'var(--color-bus)',
  '--color-hover': 'var(--color-bus-dark-50)',
  '--color-focus': 'var(--color-bus)',
  '--color-hover-focus': 'var(--color-bus-dark-50)',
  '--color-disabled': 'var(--color-black-40)',
};

const dangerAndSuccessButtonVariables = {
  '--color': 'var(--color-white)',
  '--color-hover': 'var(--color-white)',
  '--color-focus': 'var(--color-white)',
  '--color-hover-focus': 'var(--color-white)',
  '--focus-outline-color': 'var(--color-coat-of-arms-blue)',
};

const commonNotificationVariables = {
  '--notification-border-width': 'var(--spacing-2-xs)',
  '--notification-color': 'var(--color-black-90)',
  '--notification-focus-outline-color': 'var(--color-coat-of-arms-blue)',
  '--notification-max-width-inline': 'none',
  '--notification-max-width-toast': '21rem',
  '--notification-offset': 'var(--spacing-layout-s)',
  '--notification-z-index': 99,
};

const theme: Theme = {
  button: {
    primary: {
      ...commonButtonVariables,
      '--background-color': 'var(--color-bus)',
      '--background-color-hover': 'var(--color-bus-dark-50)',
      '--background-color-focus': 'var(--color-bus)',
      '--background-color-hover-focus': 'var(--color-bus-dark-50)',
      '--background-color-disabled': 'var(--color-black-20)',
      '--border-color': 'var(--color-bus)',
      '--border-color-hover': 'var(--color-bus-dark-50)',
      '--border-color-focus': 'var(--color-bus)',
      '--border-color-hover-focus': 'var(--color-bus-dark-50)',
      '--border-color-disabled': 'var(--color-black-20)',
      '--color': 'var(--color-white)',
      '--color-hover': 'var(--color-white)',
      '--color-focus': 'var(--color-white)',
      '--color-hover-focus': 'var(--color-white)',
      '--color-disabled': 'var(--color-white)',
    },
    secondary: {
      ...commonButtonVariables,
      ...secondaryAndSumplementaryButtonVariables,
      '--border-color': 'var(--color-bus)',
      '--border-color-hover': 'var(--color-bus-dark-50)',
      '--border-color-focus': 'var(--color-bus)',
      '--border-color-hover-focus': 'var(--color-bus-dark-50)',
      '--border-color-disabled': 'var(--color-black-50)',
    },
    supplementary: {
      ...commonButtonVariables,
      ...secondaryAndSumplementaryButtonVariables,
      '--border-color': 'transparent',
      '--border-color-hover': 'transparent',
      '--border-color-focus': 'var(--color-coat-of-arms-blue)',
      '--border-color-hover-focus': 'var(--color-coat-of-arms-blue)',
      '--border-color-disabled': 'transparent',
      '--focus-outline-color': 'transparent',
      '--submit-input-focus-gutter-color': 'transparent',
    },
    success: {
      ...commonButtonVariables,
      ...dangerAndSuccessButtonVariables,
      '--background-color': 'var(--color-success)',
      '--background-color-hover': 'var(--color-success-dark)',
      '--background-color-focus': 'var(--color-success)',
      '--background-color-hover-focus': 'var(--color-success-dark)',
      '--border-color': 'var(--color-success)',
      '--border-color-hover': 'var(--color-success-dark)',
      '--border-color-focus': 'var(--color-success)',
      '--border-color-hover-focus': 'var(--color-success-dark)',
    },
    danger: {
      ...commonButtonVariables,
      ...dangerAndSuccessButtonVariables,
      '--background-color': 'var(--color-error)',
      '--background-color-hover': 'var(--color-error-dark)',
      '--background-color-focus': 'var(--color-error)',
      '--background-color-hover-focus': 'var(--color-error-dark)',
      '--border-color': 'var(--color-error)',
      '--border-color-hover': 'var(--color-error-dark)',
      '--border-color-focus': 'var(--color-error)',
      '--border-color-hover-focus': 'var(--color-error-dark)',
    },
  },
  checkbox: {
    '--size': '24px',
    '--icon-scale': 1,
    '--border-radius': '1px',
    '--border-width': '2px',
    '--outline-width': '3px',
    '--label-font-size': 'var(--fontsize-body-m)',
    '--label-padding': 'var(--spacing-2-xs)',
    '--background-unselected': 'transparent',
    '--background-selected': 'var(--color-bus)',
    '--background-hover': 'var(--color-bus-dark-50)',
    '--background-disabled': 'var(--color-black-10)',
    '--border-color-selected': 'var(--color-bus)',
    '--border-color-selected-hover': 'var(--color-bus-dark-50)',
    '--border-color-selected-focus': 'var(--color-bus)',
    '--border-color-unselected': 'var(--color-black-50)',
    '--border-color-unselected-hover': 'var(--color-black-90)',
    '--border-color-unselected-focus': 'var(--color-black-90)',
    '--border-color-disabled': 'var(--color-black-10)',
    '--icon-color-unselected': 'transparent',
    '--icon-color-selected': 'var(--color-white)',
    '--icon-color-disabled': 'var(--color-white)',
    '--focus-outline-color': 'var(--color-coat-of-arms-blue)',
    '--label-color': 'var(--color-black-90)',
    '--label-color-disabled': 'var(--color-black-40)',
  },
  eventNavigation: {
    '--circle-background-color': 'transparent',
    '--circle-border-color': 'var(--color-bus)',
    '--circle-color': 'var(--color-bus)',
    '--circle-background-color-completed': 'var(--color-bus)',
    '--circle-border-color-completed': 'var(--color-bus)',
    '--circle-color-completed': 'var(--color-white)',
    '--circle-background-color-disabled': 'var(--color-bus-light-20)',
    '--circle-border-color-disabled': 'var(--color-bus-light-20)',
    '--circle-color-disabled': 'var(--color-white)',
    '--connection-line-color': 'var(--color-bus-light-20)',
    '--label-color': 'var(--color-black-90)',
  },
  layout: {
    '--page-background-color': 'var(--color-white)',
  },
  languageSelector: {
    '--dropdown-background-default': 'var(--color-black)',
    '--dropdown-border-color-default': 'transparent',
    '--dropdown-border-color-hover': 'transparent',
    '--dropdown-border-color-focus': 'transparent',
    '--dropdown-color-default': 'inherit',
    '--placeholder-color': 'inherit',
    '--menu-z-index': 10,
    '--menu-item-background-default': 'var(--color-white)',
    '--menu-item-background-hover': 'var(--color-black-10)',
    '--menu-item-color-default': 'var(--color-black-90)',
    '--menu-item-color-hover': 'var(--color-black-90)',
  },
  loadingSpinner: {
    '--spinner-background-color': 'transparent',
    '--spinner-color': 'var(--color-bus)',
    '--spinner-width': '120px',
    '--spinner-stroke-width': '20px',
  },
  navigation: {
    '--header-z-index': 10,
    '--header-background-color': 'var(--color-coat-of-arms-blue)',
    '--header-color': 'var(--color-white)',
    '--header-divider-color': 'var(--color-black-20)',
    '--header-focus-outline-color': 'var(--color-white)',
    '--navigation-row-background-color': 'var(--color-white)',
    '--navigation-row-color': 'var(--color-coat-of-arms-blue)',
    '--navigation-row-focus-outline-color': 'var(--color-coat-of-arms-blue)',
    '--navigation-item-color': 'var(--color-black-90)',
    '--mobile-menu-z-index': 9,
    '--mobile-menu-background-color': 'var(--color-white)',
    '--mobile-menu-color': 'var(--color-black-90)',
  },
  notification: {
    size: {
      default: {
        '--notification-padding': 'var(--spacing-s)',
      },
      large: {
        '--notification-padding': 'var(--spacing-l)',
      },
      small: {
        '--notification-padding': 'var(--spacing-2-xs)',
      },
    },
    type: {
      alert: {
        ...commonNotificationVariables,
        '--notification-background-color': 'var(--color-alert-light)',
        '--notification-border-color': 'var(--color-alert-dark)',
      },

      error: {
        ...commonNotificationVariables,
        '--notification-background-color': 'var(--color-error-light)',
        '--notification-border-color': 'var(--color-error)',
      },
      info: {
        ...commonNotificationVariables,
        '--notification-background-color': 'var(--color-info-light)',
        '--notification-border-color': 'var(--color-info)',
      },

      success: {
        ...commonNotificationVariables,
        '--notification-background-color': 'var(--color-success-light)',
        '--notification-border-color': 'var(--color-success)',
      },
    },
  },
  radioButton: {
    '--size': '24px',
    '--icon-scale': 0.5,
    '--border-width': '2px',
    '--outline-width': '3px',
    '--label-font-size': 'var(--fontsize-body-m)',
    '--label-padding': 'var(--spacing-2-xs)',
    '--background': 'var(--color-white)',
    '--background-hover': 'var(--color-white)',
    '--background-focus': 'var(--color-white)',
    '--background-unselected-disabled': 'var(--color-black-10)',
    '--background-selected-disabled': 'var(--color-white)',
    '--border-color-focus': 'var(--color-black-90)',
    '--border-color-selected': 'var(--color-bus)',
    '--border-color-selected-hover': 'var(--color-bus-dark-50)',
    '--border-color-selected-disabled': 'var(--color-black-20)',
    '--border-color-unselected': 'var(--color-black-50)',
    '--border-color-unselected-hover': 'var(--color-black-90)',
    '--border-color-unselected-disabled': 'var(--color-black-10)',
    '--icon-color-selected': 'var(--color-bus)',
    '--icon-color-unselected': 'transparent',
    '--icon-color-hover': 'var(--color-bus-dark-50)',
    '--icon-color-disabled': 'var(--color-black-10)',
    '--focus-outline-color': 'var(--color-coat-of-arms-blue)',
    '--label-color': 'var(--color-black-90)',
    '--label-color-disabled': 'var(--color-black-40)',
  },
  select: {
    '--border-radius': '2px',
    '--border-width': '2px',
    '--divider-width': '1px',
    '--focus-outline-width': '3px',
    '--dropdown-height': 'var(--spacing-3-xl)',
    '--menu-item-height':
      'calc(var(--dropdown-height) - var(--border-width) * 2)',
    '--icon-size': 'var(--spacing-m)',
    '--menu-z-index': 101,
    '--dropdown-background-default': 'var(--color-white)',
    '--dropdown-background-disabled': 'var(--color-black-10)',
    '--dropdown-border-color-default': 'var(--color-black-50)',
    '--dropdown-border-color-hover': 'var(--color-black-90)',
    '--dropdown-border-color-hover-invalid': 'var(--color-error-dark)',
    '--dropdown-border-color-focus': 'var(--color-black-90)',
    '--dropdown-border-color-invalid': 'var(--color-error)',
    '--dropdown-border-color-disabled': 'var(--color-black-10)',
    '--dropdown-color-default': 'var(--color-black-90)',
    '--dropdown-color-disabled': 'var(--color-black-40)',
    '--focus-outline-color': 'var(--color-coat-of-arms-blue)',
    '--helper-color-default': 'var(--color-black-60)',
    '--helper-color-invalid': 'var(--color-error)',
    '--menu-divider-color': 'var(--color-black-20)',
    '--menu-item-background-default': 'var(--color-white)',
    '--menu-item-background-hover': 'var(--color-bus)',
    '--menu-item-background-selected': 'var(--color-white)',
    '--menu-item-background-selected-hover': 'var(--color-bus)',
    '--menu-item-background-disabled': 'var(--color-white)',
    '--menu-item-color-default': 'var(--color-black-90)',
    '--menu-item-color-hover': 'var(--color-white)',
    '--menu-item-color-selected': 'var(--color-black-90)',
    '--menu-item-color-selected-hover': 'var(--color-white)',
    '--menu-item-color-disabled': 'var(--color-black-40)',
    '--menu-item-icon-color-selected': 'var(--color-white)',
    '--menu-item-icon-color-disabled': 'var(--color-black-40)',
    '--multiselect-checkbox-background-selected': 'var(--color-bus)',
    '--multiselect-checkbox-background-disabled': 'var(--color-black-10)',
    '--multiselect-checkbox-border-default': 'var(--color-black-50)',
    '--multiselect-checkbox-border-hover': 'var(--color-black-90)',
    '--multiselect-checkbox-border-disabled': 'var(--color-black-10)',
    '--multiselect-checkbox-color-default': 'transparent',
    '--multiselect-checkbox-color-selected': 'var(--color-white)',
    '--multiselect-checkbox-color-selected-disabled': 'var(--color-white)',
    '--placeholder-color': 'var(--color-black-60)',
  },
  textInput: {
    '--border-radius': '2px',
    '--border-width': '2px',
    '--outline-width': '3px',
    '--input-height': '56px',
    '--textarea-height': '149px',
    '--icon-size': 'var(--spacing-m)',
    '--helper-color-default': 'var(--color-black-60)',
    '--helper-color-invalid': 'var(--color-error)',
    '--icon-color-invalid': 'var(--color-error)',
    '--input-background-default': 'var(--color-white)',
    '--input-background-disabled': 'var(--color-black-10)',
    '--input-border-color-default': 'var(--color-black-50)',
    '--input-border-color-hover': 'var(--color-black-90)',
    '--input-border-color-focus': 'var(--color-black-90)',
    '--input-border-color-invalid': 'var(--color-error)',
    '--input-border-color-disabled': 'var(--color-black-10)',
    '--input-color-default': 'var(--color-black-90)',
    '--input-color-disabled': 'var(--color-black-40)',
    '--label-color-default': 'var(--color-black-90)',
    '--label-color-invalid': 'var(--color-black-90)',
    '--placeholder-color': 'var(--color-black-60)',
    '--focus-outline-color': 'var(--color-coat-of-arms-blue)',
  },
};

export default theme;
