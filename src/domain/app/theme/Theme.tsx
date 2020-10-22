import { SelectCustomTheme } from 'hds-react/components/Select';
import React, { useContext, useState } from 'react';

type ButtonCSSProperties = {
  '--background-color'?: string;
  '--background-color-hover'?: string;
  '--background-color-focus'?: string;
  '--background-color-hover-focus'?: string;
  '--background-color-disabled'?: string;
  '--border-color'?: string;
  '--border-color-hover'?: string;
  '--border-color-focus'?: string;
  '--border-color-hover-focus'?: string;
  '--border-color-disabled'?: string;
  '--color'?: string;
  '--color-hover'?: string;
  '--color-focus'?: string;
  '--color-hover-focus'?: string;
  '--color-disabled'?: string;
  '--focus-outline-color'?: string;
  '--submit-input-focus-gutter-color'?: string;
};

type CheckboxCSSProperties = {
  '--size'?: string;
  '--icon-scale'?: number;
  '--border-radius'?: string;
  '--border-width'?: string;
  '--outline-width'?: string;
  '--label-font-size'?: string;
  '--label-padding'?: string;
  '--background-unselected'?: string;
  '--background-selected'?: string;
  '--background-hover'?: string;
  '--background-disabled'?: string;
  '--border-color-selected'?: string;
  '--border-color-selected-hover'?: string;
  '--border-color-selected-focus'?: string;
  '--border-color-unselected'?: string;
  '--border-color-unselected-hover'?: string;
  '--border-color-unselected-focus'?: string;
  '--border-color-disabled'?: string;
  '--icon-color-unselected'?: string;
  '--icon-color-selected'?: string;
  '--icon-color-disabled'?: string;
  '--focus-outline-color'?: string;
  '--label-color'?: string;
  '--label-color-disabled'?: string;
};

type EventNavigationCSSProperties = {
  '--circle-background-color'?: string;
  '--circle-border-color'?: string;
  '--circle-color'?: string;
  '--circle-background-color-completed'?: string;
  '--circle-border-color-completed'?: string;
  '--circle-color-completed'?: string;
  '--circle-background-color-disabled'?: string;
  '--circle-border-color-disabled'?: string;
  '--circle-color-disabled'?: string;
  '--connection-line-color'?: string;
  '--label-color'?: string;
};

type LanguageSelectorCSSProperties = {
  '--dropdown-background-default'?: string;
  '--dropdown-border-color-default'?: string;
  '--dropdown-border-color-hover'?: string;
  '--dropdown-border-color-focus'?: string;
  '--dropdown-color-default'?: string;
  '--placeholder-color'?: string;
  '--menu-z-index'?: number;
  '--menu-item-background-default'?: string;
  '--menu-item-background-hover'?: string;
  '--menu-item-color-default'?: string;
  '--menu-item-color-hover'?: string;
};

type LayoutCSSProperties = {
  '--page-background-color'?: string;
};

type NavigationCSSProperties = {
  '--header-z-index'?: number;
  '--header-background-color'?: string;
  '--header-color'?: string;
  '--header-divider-color'?: string;
  '--navigation-row-background-color'?: string;
  '--header-focus-outline-color'?: string;
  '--navigation-row-color'?: string;
  '--navigation-row-focus-outline-color'?: string;
  '--navigation-item-color'?: string;
  '--mobile-menu-z-index'?: number;
  '--mobile-menu-background-color'?: string;
  '--mobile-menu-color'?: string;
};

type NotificationCSSProperties = {
  '--notification-background-color'?: string;
  '--notification-border-color'?: string;
  '--notification-border-width'?: string;
  '--notification-color'?: string;
  '--notification-focus-outline-color'?: string;
  '--notification-max-width-inline'?: string;
  '--notification-max-width-toast'?: string;
  '--notification-offset'?: string;
  '--notification-z-index'?: number;
};

type NotificationSizeCSSProperties = {
  '--notification-padding'?: string;
};

type RadioButtonCSSProperties = {
  '--size'?: string;
  '--icon-scale'?: number;
  '--border-width'?: string;
  '--outline-width'?: string;
  '--label-font-size'?: string;
  '--label-padding'?: string;
  '--background'?: string;
  '--background-hover'?: string;
  '--background-focus'?: string;
  '--background-unselected-disabled'?: string;
  '--background-selected-disabled'?: string;
  '--border-color-focus'?: string;
  '--border-color-selected'?: string;
  '--border-color-selected-hover'?: string;
  '--border-color-selected-disabled'?: string;
  '--border-color-unselected'?: string;
  '--border-color-unselected-hover'?: string;
  '--border-color-unselected-disabled'?: string;
  '--icon-color-selected'?: string;
  '--icon-color-unselected'?: string;
  '--icon-color-hover'?: string;
  '--icon-color-disabled'?: string;
  '--focus-outline-color'?: string;
  '--label-color'?: string;
  '--label-color-disabled'?: string;
};

type SelectCSSProperties = {
  '--border-radius'?: string;
  '--border-width'?: string;
  '--divider-width'?: string;
  '--focus-outline-width'?: string;
  '--dropdown-height'?: string;
  '--menu-item-height'?: string;
  '--icon-size'?: string;
  '--menu-z-index'?: number;
} & Partial<SelectCustomTheme>;

export type Theme = {
  button: {
    primary?: ButtonCSSProperties;
    secondary?: ButtonCSSProperties;
    supplementary?: ButtonCSSProperties;
    success?: ButtonCSSProperties;
    danger?: ButtonCSSProperties;
  };
  checkbox: CheckboxCSSProperties;
  eventNavigation: EventNavigationCSSProperties;
  languageSelector: LanguageSelectorCSSProperties;
  layout: LayoutCSSProperties;
  navigation: NavigationCSSProperties;
  notification: {
    size?: {
      default?: NotificationSizeCSSProperties;
      large?: NotificationSizeCSSProperties;
      small?: NotificationSizeCSSProperties;
    };
    type?: {
      alert?: NotificationCSSProperties;
      error?: NotificationCSSProperties;
      info?: NotificationCSSProperties;
      success?: NotificationCSSProperties;
    };
  };
  radioButton: RadioButtonCSSProperties;
  select: SelectCSSProperties;
};

const defaultTheme: Theme = {
  button: {},
  checkbox: {},
  eventNavigation: {},
  languageSelector: {},
  layout: {},
  navigation: {},
  notification: {},
  radioButton: {},
  select: {},
};

type ThemeContext = { setTheme: (theme: Theme) => void; theme: Theme };

export const ThemeContext = React.createContext<ThemeContext>(
  {} as ThemeContext
);

type ThemeProvideProps = {
  initTheme?: Theme;
};

export const ThemeProvider: React.FC<ThemeProvideProps> = ({
  children,
  initTheme = defaultTheme,
}) => {
  const [theme, setTheme] = useState<Theme>(initTheme);

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
