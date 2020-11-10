import { Formik } from 'formik';
import React from 'react';

import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import { render, screen, userEvent } from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import DescriptionSection from '../DescriptionSection';

const languages: EVENT_INFO_LANGUAGES[] = [
  EVENT_INFO_LANGUAGES.FI,
  EVENT_INFO_LANGUAGES.SV,
];
const type = EVENT_TYPE.EVENT;

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
        [EVENT_FIELDS.INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
        [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
        [EVENT_FIELDS.SHORT_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={jest.fn()}
    >
      <DescriptionSection />
    </Formik>
  );

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

  userEvent.click(screen.getByRole('button', { name: /ruotsi/i }));

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
