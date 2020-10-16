import { Theme } from '../../domain/app/theme/Theme';

const theme: Theme = {
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
};

export default theme;
