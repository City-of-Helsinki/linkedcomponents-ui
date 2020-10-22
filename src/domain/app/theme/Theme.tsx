import React, { useContext, useState } from 'react';

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

export type Theme = {
  eventNavigation: EventNavigationCSSProperties;
  languageSelector: LanguageSelectorCSSProperties;
  layout: LayoutCSSProperties;
  navigation: NavigationCSSProperties;
};

const defaultTheme: Theme = {
  eventNavigation: {},
  languageSelector: {},
  layout: {},
  navigation: {},
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
