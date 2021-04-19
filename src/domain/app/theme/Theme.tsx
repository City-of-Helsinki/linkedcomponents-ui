import {
  FooterCustomTheme,
  LoadingSpinnerCustomTheme,
  SelectCustomTheme,
} from 'hds-react';
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

type CollapsibleCSSProperties = {
  '--heading-background-color'?: string;
  '--heading-border-color'?: string;
  '--heading-color'?: string;
  '--heading-background-color-expanded'?: string;
  '--heading-border-color-expanded'?: string;
  '--heading-color-expanded'?: string;
  '--heading-background-color-expanded-hover'?: string;
  '--heading-border-color-expanded-hover'?: string;
  '--heading-color-expanded-hover'?: string;
  '--heading-background-color-hover'?: string;
  '--heading-color-hover'?: string;
};

type DatepickerCSSProperties = {
  '--close-button-color'?: string;
  '--day-background-color'?: string;
  '--day-background-color-disabled'?: string;
  '--day-background-color-focused'?: string;
  '--day-background-color-hovered'?: string;
  '--day-background-color-selected'?: string;
  '--day-border-color'?: string;
  '--day-border-color-disabled'?: string;
  '--day-border-color-focused'?: string;
  '--day-border-color-hovered'?: string;
  '--day-border-color-selected'?: string;
  '--day-color'?: string;
  '--day-color-disabled'?: string;
  '--day-color-focused'?: string;
  '--day-color-hovered'?: string;
  '--day-color-selected'?: string;
  '--day-size'?: string;
  '--datepicker-background-color'?: string;
  '--datepicker-container-padding'?: string;
  '--datepicker-z-index'?: number;
  '--icon-width'?: string;
  '--input-spacing'?: string;
  '--month-title-color'?: string;
  '--times-divider-border-color'?: string;
  '--times-list-width'?: string;
  '--time-item-background-color'?: string;
  '--time-item-background-color-focused'?: string;
  '--time-item-background-color-selected'?: string;
  '--time-item-color'?: string;
  '--time-item-color-focused'?: string;
  '--time-item-color-selected'?: string;
};

type DeleteButtonCSSProperties = {
  '--delete-button-color'?: string;
};

type ErrorTemplateCSSProperties = {
  '--error-template-icon-color'?: string;
  '--error-template-icon-size'?: string;
};

type EventCardCSSProperties = {
  '--event-card-background-color'?: string;
  '--event-card-color'?: string;
  '--event-card-icon-color'?: string;
  '--event-card-heading-color'?: string;
  '--event-card-image-background-color'?: string;
  '--event-card-image-min-height'?: string;
  '--event-card-mobile-image-min-height'?: string;
};

type EventSearchPanelCSSProperties = {
  '--event-search-panel-background-color'?: string;
  '--event-search-panel-label-color'?: string;
  '--event-search-panel-button-background-color'?: string;
  '--event-search-panel-button-background-color-hover'?: string;
  '--event-search-panel-button-background-color-focus'?: string;
  '--event-search-panel-button-background-color-hover-focus'?: string;
  '--event-search-panel-button-border-color'?: string;
  '--event-search-panel-button-color'?: string;
  '--event-search-panel-button-focus-outline-color'?: string;
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

type NavigationDropdownCSSProperties = {
  '--menu-border-width'?: string;
  '--menu-border-color'?: string;
  '--menu-button-focus-outline-color'?: string;
  '--menu-item-background-color'?: string;
  '--menu-item-background-color-highlighted'?: string;
  '--menu-item-color'?: string;
  '--menu-item-color-highlighted'?: string;
};

type LandingPageCSSProperties = {
  '--landing-page-cta-button-background-color'?: string;
  '--landing-page-cta-button-background-color-hover'?: string;
  '--landing-page-cta-button-background-color-focus'?: string;
  '--landing-page-cta-button-background-color-hover-focus'?: string;
  '--landing-page-cta-button-border-color'?: string;
  '--landing-page-cta-button-border-color-hover'?: string;
  '--landing-page-cta-button-border-color-focus'?: string;
  '--landing-page-cta-button-border-color-hover-focus'?: string;
  '--landing-page-cta-button-color'?: string;
  '--landing-page-cta-button-focus-outline-color'?: string;
  '--landing-page-hero-heading-color'?: string;
  '--landing-page-hero-koros-color'?: string;
  '--landing-page-search-button-background-color'?: string;
  '--landing-page-search-button-background-color-hover'?: string;
  '--landing-page-search-button-background-color-focus'?: string;
  '--landing-page-search-button-background-color-hover-focus'?: string;
  '--landing-page-search-button-border-color'?: string;
  '--landing-page-search-button-color'?: string;
  '--landing-page-search-button-focus-outline-color'?: string;
};

type LayoutCSSProperties = {
  '--page-background-color'?: string;
};

type LoadingSpinnerCSSProperties = {
  '--spinner-size'?: string;
  '--spinner-thickness'?: string;
  '--spinner-size-small'?: string;
  '--spinner-thickness-small'?: string;
} & Partial<LoadingSpinnerCustomTheme>;

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
  '--modal-bottom'?: string;
  '--modal-max-width-m'?: string;
  '--modal-max-width-l'?: string;
  '--modal-top'?: string;
  '--modal-z-index'?: number;
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
  '--dropdown-button-height'?: string;
  '--dropdown-clear-button-color'?: string;
  '--dropdown-clear-button-border-top-color'?: string;
  '--dropdown-divider-color'?: string;
  '--dropdown-icon-size'?: string;
  '--dropdown-menu-background'?: string;
  '--dropdown-menu-color'?: string;
  '--dropdown-menu-max-height'?: string;
  '--dropdown-menu-z-index'?: number;
};

type NavigationCSSProperties = {
  '--header-z-index'?: number;
  '--header-background-color'?: string;
  '--header-color'?: string;
  '--header-divider-color'?: string;
  '--navigation-row-background-color'?: string;
  '--header-focus-outline-color'?: string;
  '--header-focus-outline-border-radius'?: string;
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

type PaginationCSSProperties = {
  '--pagination-item-background-color'?: string;
  '--pagination-item-background-color-disabled'?: string;
  '--pagination-item-background-color-hover'?: string;
  '--pagination-item-background-color-selected'?: string;
  '--pagination-item-color'?: string;
  '--pagination-item-color-disabled'?: string;
  '--pagination-item-color-hover'?: string;
  '--pagination-item-color-selected'?: string;
  '--pagination-item-size'?: string;
  '--pagination-item-border-radius'?: string;
};

type PublicationStatusCSSProperties = {
  '--publication-status-color-draft'?: string;
  '--publication-status-color-public'?: string;
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

type RootCSSProperties = {
  '--focus-outline-color'?: string;
  '--focus-outline-width'?: string;
  '--input-height'?: string;
  '--input-max-width-m'?: string;
  '--input-max-width-l'?: string;
  '--label-height'?: string;
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

type SideNavigationCSSProperties = {
  '--side-navigation-background-color'?: string;
  '--side-navigation-active-indicator-background-color'?: string;
  '--side-navigation-icon-size'?: string;
  '--side-navigation-level-border-color'?: string;
  '--side-navigation-level-border-color-focus'?: string;
  '--side-navigation-level-border-color-hover'?: string;
  '--side-navigation-level-border-width'?: string;
  '--side-navigation-level-background-color'?: string;
  '--side-navigation-level-background-color-active'?: string;
  '--side-navigation-level-background-color-hover'?: string;
  '--side-navigation-level-color'?: string;
  '--side-navigation-mobile-menu-border-color'?: string;
  '--side-navigation-mobile-menu-border-width'?: string;
  '--side-navigation-mobile-menu-z-index'?: number;
};

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

type TableCSSProperties = {
  '--table-body-background'?: string;
  '--table-body-row-border-color'?: string;
  '--table-head-background'?: string;
};

type TabsCSSProperties = {
  '--tabs-icon-color'?: string;
  '--tabs-tab-color'?: string;
  '--tabs-tab-color-active'?: string;
};

type TextEditorCSSProperties = {
  '--text-editor-border-color'?: string;
  '--text-editor-editor-max-height'?: string;
  '--text-editor-editor-min-height'?: string;
  '--text-editor-toolbar-border-color'?: string;
};

type TextInputCSSProperties = {
  '--border-radius'?: string;
  '--border-width'?: string;
  '--outline-width'?: string;
  '--input-height'?: string;
  '--textarea-height'?: string;
  '--icon-size'?: string;
  '--helper-color-default'?: string;
  '--helper-color-invalid'?: string;
  '--icon-color-invalid'?: string;
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

type TimepickerCSSProperties = {
  '--menu-background-color'?: string;
  '--menu-border-color'?: string;
  '--menu-max-height'?: string;
  '--menu-z-index'?: number;
  '--menu-item-background-color'?: string;
  '--menu-item-background-color-highlighted'?: string;
  '--menu-item-fontsize'?: string;
  '--menu-item-spacing'?: string;
};

export type Theme = {
  button: {
    primary?: ButtonCSSProperties;
    secondary?: ButtonCSSProperties;
    supplementary?: ButtonCSSProperties;
    success?: ButtonCSSProperties;
    danger?: ButtonCSSProperties;
  };
  checkbox: CheckboxCSSProperties;
  collapsible: CollapsibleCSSProperties;
  datepicker: DatepickerCSSProperties;
  deleteButton: DeleteButtonCSSProperties;
  dropdown: DropdownCSSProperties;
  errorTemplate: ErrorTemplateCSSProperties;
  eventCard: EventCardCSSProperties;
  eventSearchPanel: EventSearchPanelCSSProperties;
  footer: FooterCSSProperties;
  imageSelector: ImageSelectorCSSProperties;
  landingPage: LandingPageCSSProperties;
  layout: LayoutCSSProperties;
  loadingSpinner: LoadingSpinnerCSSProperties;
  menuDropdown: MenuDropdownCSSProperties;
  modal: ModalCSSProperties;
  navigation: NavigationCSSProperties;
  navigationDropdown: NavigationDropdownCSSProperties;
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
  pagination: PaginationCSSProperties;
  publicationStatus: PublicationStatusCSSProperties;
  radioButton: RadioButtonCSSProperties;
  root: RootCSSProperties;
  select: SelectCSSProperties;
  sideNavigation: SideNavigationCSSProperties;
  statusTag: StatusTagCSSProperties;
  superEventTypeTag: SuperEventTypeTagCSSProperties;
  table: TableCSSProperties;
  tabs: TabsCSSProperties;
  textEditor: TextEditorCSSProperties;
  textInput: TextInputCSSProperties;
  timepicker: TimepickerCSSProperties;
};

const defaultTheme: Theme = {
  button: {},
  checkbox: {},
  collapsible: {},
  datepicker: {},
  deleteButton: {},
  dropdown: {},
  errorTemplate: {},
  eventCard: {},
  eventSearchPanel: {},
  footer: {},
  imageSelector: {},
  landingPage: {},
  layout: {},
  loadingSpinner: {},
  menuDropdown: {},
  modal: {},
  navigation: {},
  navigationDropdown: {},
  notification: {},
  pagination: {},
  publicationStatus: {},
  radioButton: {},
  root: {},
  select: {},
  sideNavigation: {},
  statusTag: {},
  superEventTypeTag: {},
  table: {},
  tabs: {},
  textEditor: {},
  textInput: {},
  timepicker: {},
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
