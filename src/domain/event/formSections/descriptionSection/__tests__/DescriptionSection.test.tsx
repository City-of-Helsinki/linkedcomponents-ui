import { Formik } from 'formik';
import React from 'react';

import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import {
  actWait,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import { MultiLanguageObject } from '../../../types';
import DescriptionSection from '../DescriptionSection';

const languages: EVENT_INFO_LANGUAGES[] = [
  EVENT_INFO_LANGUAGES.FI,
  EVENT_INFO_LANGUAGES.SV,
];
const type = EVENT_TYPE.EVENT;

type InitialValues = {
  [EVENT_FIELDS.DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: EVENT_INFO_LANGUAGES[];
  [EVENT_FIELDS.INFO_URL]: MultiLanguageObject;
  [EVENT_FIELDS.NAME]: MultiLanguageObject;
  [EVENT_FIELDS.SHORT_DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
  [EVENT_FIELDS.INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.SHORT_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.TYPE]: type,
};

const renderComponent = (initialValues?: Partial<InitialValues>) => {
  const { rerender, ...rest } = render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
    >
      <DescriptionSection />
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
          <DescriptionSection />
        </Formik>
      ),
    ...rest,
  };
};

test('should show description form section fields', () => {
  const langText = lowerCaseFirstLetter(translations.form.inLanguage.fi);

  renderComponent();
  const fieldLabels = [
    translations.event.form.labelName[type].replace('{{langText}}', langText),
    translations.event.form.labelInfoUrl[type].replace(
      '{{langText}}',
      langText
    ),
    translations.event.form.labelShortDescription[type].replace(
      '{{langText}}',
      langText
    ),
    translations.event.form.labelDescription[type].replace(
      '{{langText}}',
      langText
    ),
  ];

  fieldLabels.forEach((name) => {
    expect(screen.queryByRole('textbox', { name })).toBeInTheDocument();
  });
});

test('should change form section language', () => {
  renderComponent();

  userEvent.click(
    screen.getByRole('link', { name: translations.form.language.sv })
  );

  const langText = lowerCaseFirstLetter(translations.form.inLanguage.sv);
  const fieldLabels = [
    translations.event.form.labelName[type].replace('{{langText}}', langText),
    translations.event.form.labelInfoUrl[type].replace(
      '{{langText}}',
      langText
    ),
    translations.event.form.labelShortDescription[type].replace(
      '{{langText}}',
      langText
    ),
    translations.event.form.labelDescription[type].replace(
      '{{langText}}',
      langText
    ),
  ];

  fieldLabels.forEach((name) => {
    expect(screen.queryByRole('textbox', { name })).toBeInTheDocument();
  });
});

// eslint-disable-next-line max-len
test('should change selected language when current selected language is removed from event info languages', async () => {
  const { rerender } = renderComponent({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
      EVENT_INFO_LANGUAGES.FI,
      EVENT_INFO_LANGUAGES.SV,
    ],
  });

  const fiButtonText = translations.form.language.fi;
  const svButtonText = translations.form.language.sv;

  expect(
    screen.queryByRole('link', { name: fiButtonText })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: svButtonText })
  ).toBeInTheDocument();

  expect(
    screen
      .queryByRole('link', { name: fiButtonText })
      .getAttribute('aria-current')
  ).toBe('step');
  expect(
    screen
      .queryByRole('link', { name: svButtonText })
      .getAttribute('aria-current')
  ).toBe('false');

  rerender({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [EVENT_INFO_LANGUAGES.SV],
  });
  await actWait();

  expect(
    screen.queryByRole('link', { name: fiButtonText })
  ).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: svButtonText })).toBeInTheDocument();

  expect(
    screen
      .queryByRole('link', { name: svButtonText })
      .getAttribute('aria-current')
  ).toBe('step');
});
