import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import { MultiLanguageObject } from '../../../types';
import DescriptionSection, {
  DescriptionSectionProps,
} from '../DescriptionSection';

configure({ defaultHidden: true });

const languages: EVENT_INFO_LANGUAGES[] = [
  EVENT_INFO_LANGUAGES.FI,
  EVENT_INFO_LANGUAGES.SV,
];
const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: EVENT_INFO_LANGUAGES[];
  [EVENT_FIELDS.NAME]: MultiLanguageObject;
  [EVENT_FIELDS.SHORT_DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
  [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.SHORT_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.TYPE]: type,
};

const defaultProps: DescriptionSectionProps = {
  selectedLanguage: languages[0],
  setSelectedLanguage: jest.fn(),
};

const renderComponent = (
  initialValues?: Partial<InitialValues>,
  props?: Partial<DescriptionSectionProps>
) => {
  const { rerender, ...rest } = render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
    >
      <DescriptionSection {...defaultProps} {...props} />
    </Formik>
  );

  return {
    rerender: (newInitialValues?: Partial<InitialValues>) =>
      rerender(
        <Formik
          initialValues={{
            ...defaultInitialValues,
            ...initialValues,
            ...newInitialValues,
          }}
          onSubmit={jest.fn()}
          enableReinitialize={true}
        >
          <DescriptionSection {...defaultProps} {...props} />
        </Formik>
      ),
    ...rest,
  };
};

const getElement = (
  key:
    | 'descriptionFi'
    | 'fiButton'
    | 'nameFi'
    | 'shortDescriptionFi'
    | 'svButton'
) => {
  switch (key) {
    case 'descriptionFi':
      return screen.getByRole('textbox', {
        name: /tapahtuman kuvaus suomeksi/i,
      });
    case 'fiButton':
      return screen.getByRole('tab', { name: /suomi/i });
    case 'nameFi':
      return screen.getByRole('textbox', {
        name: /tapahtuman otsikko suomeksi/i,
      });
    case 'shortDescriptionFi':
      return screen.getByRole('textbox', {
        name: /lyhyt kuvaus suomeksi/i,
      });
    case 'svButton':
      return screen.getByRole('tab', { name: /ruotsi/i });
  }
};

test('should show description form section fields', () => {
  renderComponent();

  getElement('nameFi');
  getElement('shortDescriptionFi');
  getElement('descriptionFi');
});

test('should change form section language', () => {
  const setSelectedLanguage = jest.fn();
  renderComponent(undefined, { setSelectedLanguage });

  const svButton = getElement('svButton');
  userEvent.click(svButton);

  expect(setSelectedLanguage).toBeCalledWith('sv');
});

// eslint-disable-next-line max-len
test('should change selected language when current selected language is removed from event info languages', () => {
  const setSelectedLanguage = jest.fn();
  const { rerender } = renderComponent(
    {
      [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
        EVENT_INFO_LANGUAGES.FI,
        EVENT_INFO_LANGUAGES.SV,
      ],
    },
    { setSelectedLanguage }
  );

  const fiButton = getElement('fiButton');
  const svButton = getElement('svButton');

  expect(fiButton).toBeInTheDocument();
  expect(svButton).toBeInTheDocument();
  expect(fiButton.getAttribute('aria-selected')).toBe('true');
  expect(svButton.getAttribute('aria-selected')).toBe('false');

  rerender({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [EVENT_INFO_LANGUAGES.SV],
  });

  expect(setSelectedLanguage).toBeCalledWith('sv');
});
