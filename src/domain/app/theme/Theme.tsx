import {
  FooterCustomTheme,
  LoadingSpinnerCustomTheme,
  PaginationCustomTheme,
  SelectCustomTheme,
  SideNavigationCustomTheme,
  TableCustomTheme,
} from 'hds-react';
import React, { useContext, useMemo, useState } from 'react';

type BreadcrumbCSSProperties = {
  '--horizontal-margin-small'?: string;
  '--horizontal-margin-medium'?: string;
  '--horizontal-margin-large'?: string;
  '--horizontal-margin-x-large'?: string;
};

export type ButtonCSSProperties = {
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

type CollapsibleCSSProperties = {
  '--heading-background-color'?: string;
  '--heading-background-color-hover'?: string;
  '--heading-background-color-expanded'?: string;
  '--heading-background-color-expanded-hover'?: string;
  '--heading-border-color'?: string;
  '--heading-border-color-hover'?: string;
  '--heading-border-color-expanded'?: string;
  '--heading-border-color-expanded-hover'?: string;
  '--heading-color'?: string;
  '--heading-color-hover'?: string;
  '--heading-color-expanded'?: string;
  '--heading-color-expanded-hover'?: string;
};

type DateInputCSSProperties = {
  '--date-background'?: string;
  '--date-color'?: string;
  '--outside-date-background'?: string;
  '--outside-date-color'?: string;
  '--selected-date-background'?: string;
  '--selected-date-color'?: string;
};

type DeleteButtonCSSProperties = {
  '--delete-button-color'?: string;
  '--delete-button-color-icon'?: string;
};

type ErrorPageCSSProperties = {
  '--error-page-icon-color'?: string;
};

type EventCardCSSProperties = {
  '--event-card-background-color'?: string;
  '--event-card-color'?: string;
  '--event-card-icon-color'?: string;
  '--event-card-heading-color'?: string;
  '--event-card-image-background-color'?: string;
};

type FooterCSSProperties = {
  '--footer-background-support'?: string;
  '--footer-color-support'?: string;
  '--footer-divider-color-support'?: string;
  '--footer-focus-outline-color-support'?: string;
} & Partial<FooterCustomTheme>;

type ImageSelectorCSSProperties = {
  '--image-selector-focus-outline-color'?: string;
};

type LandingPageCSSProperties = {
  '--cta-button-background-color'?: string;
  '--cta-button-background-color-hover'?: string;
  '--cta-button-color'?: string;
  '--hero-heading-color'?: string;
  '--hero-koros-color'?: string;
  '--search-button-background-color'?: string;
  '--search-button-background-color-hover'?: string;
  '--search-button-color'?: string;
};

type LayoutCSSProperties = {
  '--page-background-color'?: string;
};

type LoadingSpinnerCSSProperties = Partial<LoadingSpinnerCustomTheme>;

type MenuDropdownCSSProperties = {
  '--menu-dropdown-item-background-color'?: string;
  '--menu-dropdown-item-background-color-disabled'?: string;
  '--menu-dropdown-item-background-color-highlighted'?: string;
  '--menu-dropdown-item-color'?: string;
  '--menu-dropdown-item-color-disabled'?: string;
  '--menu-dropdown-item-color-highlighted'?: string;
};

type ModalCSSProperties = {
  '--modal-background-color'?: string;
  '--modal-heading-background-color'?: string;
  '--modal-heading-color'?: string;
  '--modal-heading-background-color-alert'?: string;
  '--modal-heading-color-alert'?: string;
  '--modal-heading-background-color-info'?: string;
  '--modal-heading-color-info'?: string;
};

type DropdownCSSProperties = {
  '--dropdown-background'?: string;
  '--dropdown-border-color'?: string;
  '--dropdown-border-color-focus'?: string;
  '--dropdown-color'?: string;
  '--dropdown-clear-button-color'?: string;
  '--dropdown-clear-button-border-top-color'?: string;
  '--dropdown-divider-color'?: string;
  '--dropdown-menu-background'?: string;
  '--dropdown-menu-color'?: string;
};

type NavigationCSSProperties = {
  '--actionbar-background-color'?: string;
  '--color-focus-outline'?: string;
  '--header-background-color'?: string;
  '--header-color'?: string;
  '--lang-selector-dropdown-background-color'?: string;
  '--nav-background-color'?: string;
  '--nav-border-color'?: string;
  '--nav-link-hover-color'?: string;
  '--nav-button-background-color'?: string;
  '--nav-link-dropdown-background-color'?: string;
  '--nav-button-hover-background-color'?: string;
  '--nav-drop-down-icon-color'?: string;
  '--universal-bar-background-color'?: string;
  '--header-focus-outline-color'?: string;
};

export type NotificationCSSProperties = {
  '--notification-background-color'?: string;
  '--notification-border-color'?: string;
  '--notification-color'?: string;
  '--notification-focus-outline-color'?: string;
};

type PaginationCSSProperties = Partial<PaginationCustomTheme>;

type PublicationStatusCSSProperties = {
  '--publication-status-color-draft'?: string;
  '--publication-status-color-public'?: string;
};

type RadioButtonCSSProperties = {
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

type RegistrationSearchPanelCSSProperties = {
  '--registration-search-panel-background-color'?: string;
  '--registration-search-panel-label-color'?: string;
  '--registration-search-panel-button-background-color'?: string;
  '--registration-search-panel-button-background-color-hover'?: string;
  '--registration-search-panel-button-background-color-focus'?: string;
  '--registration-search-panel-button-background-color-hover-focus'?: string;
  '--registration-search-panel-button-border-color'?: string;
  '--registration-search-panel-button-color'?: string;
  '--registration-search-panel-button-focus-outline-color'?: string;
};

type RootCSSProperties = {
  '--focus-outline-color'?: string;
  '--helper-color-invalid'?: string;
  '--icon-color-invalid'?: string;
};

type SearchPanelCSSProperties = {
  '--search-panel-background-color'?: string;
  '--search-panel-label-color'?: string;
  '--search-panel-button-background-color'?: string;
  '--search-panel-button-background-color-hover'?: string;
  '--search-panel-button-color'?: string;
};

type SelectCSSProperties = Partial<SelectCustomTheme>;

type StatusTagCSSProperties = {
  '--status-tag-background-color-cancelled'?: string;
  '--status-tag-color-cancelled'?: string;
  '--status-tag-background-color-postponed'?: string;
  '--status-tag-color-postponed'?: string;
  '--status-tag-background-color-draft'?: string;
  '--status-tag-color-draft'?: string;
  '--status-tag-background-color-public'?: string;
  '--status-tag-color-public'?: string;
};

type SuperEventTypeTagCSSProperties = {
  '--super-event-type-tag-background-color-recurring'?: string;
  '--super-event-type-tag-color-recurring'?: string;
  '--super-event-type-tag-background-color-umbrella'?: string;
  '--super-event-type-tag-color-umbrella'?: string;
};

type TableCSSProperties = Partial<TableCustomTheme>;

type TabsCSSProperties = {
  '--tabs-icon-color'?: string;
  '--tabs-tab-color'?: string;
  '--tabs-tab-color-active'?: string;
};

type TextEditorCSSProperties = {
  '--text-editor-border-color'?: string;
};

type TextInputCSSProperties = {
  '--helper-color-default'?: string;
  '--input-background-default'?: string;
  '--input-background-disabled'?: string;
  '--input-border-color-default'?: string;
  '--input-border-color-hover'?: string;
  '--input-border-color-focus'?: string;
  '--input-border-color-invalid'?: string;
  '--input-border-color-disabled'?: string;
  '--input-color-default'?: string;
  '--input-color-disabled'?: string;
  '--label-color-default'?: string;
  '--label-color-invalid'?: string;
  '--placeholder-color'?: string;
  '--focus-outline-color'?: string;
};

export type Theme = {
  breadcrumb: BreadcrumbCSSProperties;
  button: {
    primary?: ButtonCSSProperties;
    secondary?: ButtonCSSProperties;
    supplementary?: ButtonCSSProperties;
    success?: ButtonCSSProperties;
    danger?: ButtonCSSProperties;
  };
  checkbox: CheckboxCSSProperties;
  collapsible: CollapsibleCSSProperties;
  dateInput: DateInputCSSProperties;
  deleteButton: DeleteButtonCSSProperties;
  dropdown: DropdownCSSProperties;
  errorPage: ErrorPageCSSProperties;
  eventCard: EventCardCSSProperties;
  footer: FooterCSSProperties;
  imageSelector: ImageSelectorCSSProperties;
  landingPage: LandingPageCSSProperties;
  layout: LayoutCSSProperties;
  loadingSpinner: LoadingSpinnerCSSProperties;
  menuDropdown: MenuDropdownCSSProperties;
  modal: ModalCSSProperties;
  navigation: NavigationCSSProperties;
  notification: {
    type?: {
      alert?: NotificationCSSProperties;
      error?: NotificationCSSProperties;
      info?: NotificationCSSProperties;
      success?: NotificationCSSProperties;
    };
  };
  pagination: PaginationCSSProperties;
  publicationStatus: PublicationStatusCSSProperties;
  radioButton: RadioButtonCSSProperties;
  registrationSearchPanel: RegistrationSearchPanelCSSProperties;
  root: RootCSSProperties;
  searchPanel: SearchPanelCSSProperties;
  select: SelectCSSProperties;
  sideNavigation: Partial<SideNavigationCustomTheme>;
  statusTag: StatusTagCSSProperties;
  superEventTypeTag: SuperEventTypeTagCSSProperties;
  table: {
    variant?: {
      light: TableCSSProperties;
      dark: TableCSSProperties;
    };
  };
  tabs: TabsCSSProperties;
  textEditor: TextEditorCSSProperties;
  textInput: TextInputCSSProperties;
};

const defaultTheme: Theme = {
  breadcrumb: {},
  button: {},
  checkbox: {},
  collapsible: {},
  dateInput: {},
  deleteButton: {},
  dropdown: {},
  errorPage: {},
  eventCard: {},
  footer: {},
  imageSelector: {},
  landingPage: {},
  layout: {},
  loadingSpinner: {},
  menuDropdown: {},
  modal: {},
  navigation: {},
  notification: {},
  pagination: {},
  publicationStatus: {},
  radioButton: {},
  registrationSearchPanel: {},
  root: {},
  searchPanel: {},
  select: {},
  sideNavigation: {},
  statusTag: {},
  superEventTypeTag: {},
  table: {},
  tabs: {},
  textEditor: {},
  textInput: {},
};

type ThemeContextType = { setTheme: (theme: Theme) => void; theme: Theme };

export const ThemeContext = React.createContext<ThemeContextType>(
  {} as ThemeContextType
);

type ThemeProvideProps = {
  initTheme?: Theme;
};

export const ThemeProvider: React.FC<
  React.PropsWithChildren<ThemeProvideProps>
> = ({ children, initTheme = defaultTheme }) => {
  const [theme, setTheme] = useState<Theme>(initTheme);

  const value = useMemo(() => ({ setTheme, theme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
