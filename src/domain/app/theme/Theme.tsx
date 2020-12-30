import { FooterCustomTheme } from 'hds-react/components/Footer';
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
  '--calendar-button-height'?: string;
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
  '--time-item-background-color-selected'?: string;
};

type DeleteButtonCSSProperties = {
  '--delete-button-color'?: string;
  '--delete-button-height'?: string;
  '--delete-button-padding'?: string;
};

type ErrorTemplateCSSProperties = {
  '--error-template-icon-color'?: string;
  '--error-template-icon-size'?: string;
};

type FormLanguageSelectorCSSProperties = {
  '--form-language-selector-icon-color'?: string;
  '--form-language-selector-item-color'?: string;
  '--form-language-selector-item-color-active'?: string;
};

type ImageSelectorCSSProperties = {
  '--image-selector-focus-outline-color'?: string;
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

type LoadingSpinnerCSSProperties = {
  '--spinner-background-color'?: string;
  '--spinner-color'?: string;
  '--spinner-width'?: string;
  '--spinner-stroke-width'?: string;
};

type ModalCSSProperties = {
  '--modal-background-color'?: string;
  '--modal-bottom'?: string;
  '--modal-label-height'?: string;
  '--modal-max-width'?: string;
  '--modal-top'?: string;
  '--modal-z-index'?: number;
  '--modal-heading-background-color'?: string;
  '--modal-heading-color'?: string;
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

type RootCSSProperties = {
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
  errorTemplate: ErrorTemplateCSSProperties;
  footer: Partial<FooterCustomTheme>;
  formLanguageSelector: FormLanguageSelectorCSSProperties;
  imageSelector: ImageSelectorCSSProperties;
  languageSelector: LanguageSelectorCSSProperties;
  layout: LayoutCSSProperties;
  loadingSpinner: LoadingSpinnerCSSProperties;
  modal: ModalCSSProperties;
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
  root: RootCSSProperties;
  select: SelectCSSProperties;
  textInput: TextInputCSSProperties;
  timepicker: TimepickerCSSProperties;
};

const defaultTheme: Theme = {
  button: {},
  checkbox: {},
  collapsible: {},
  datepicker: {},
  deleteButton: {},
  errorTemplate: {},
  footer: {},
  formLanguageSelector: {},
  imageSelector: {},
  languageSelector: {},
  layout: {},
  loadingSpinner: {},
  modal: {},
  navigation: {},
  notification: {},
  radioButton: {},
  root: {},
  select: {},
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
