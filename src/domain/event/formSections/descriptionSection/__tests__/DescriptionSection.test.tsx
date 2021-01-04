import { Formik } from 'formik';
import React from 'react';

import { render, screen, userEvent } from '../../../../../utils/testUtils';
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

const findComponent = (
  key:
    | 'descriptionFi'
    | 'descriptionSv'
    | 'fiButton'
    | 'infoUrlFi'
    | 'infoUrlSv'
    | 'nameFi'
    | 'nameSv'
    | 'shortDescriptionFi'
    | 'shortDescriptionSv'
    | 'svButton'
) => {
  switch (key) {
    case 'descriptionFi':
      return screen.findByRole('textbox', {
        name: /tapahtuman kuvaus suomeksi/i,
      });
    case 'descriptionSv':
      return screen.findByRole('textbox', {
        name: /tapahtuman kuvaus ruotsiksi/i,
      });
    case 'fiButton':
      return screen.findByRole('link', {
        name: /suomi/i,
      });
    case 'infoUrlFi':
      return screen.findByRole('textbox', {
        name: /tapahtuman kotisivun url suomeksi/i,
      });
    case 'infoUrlSv':
      return screen.findByRole('textbox', {
        name: /tapahtuman kotisivun url ruotsiksi/i,
      });
    case 'nameFi':
      return screen.findByRole('textbox', {
        name: /tapahtuman otsikko suomeksi/i,
      });
    case 'nameSv':
      return screen.findByRole('textbox', {
        name: /tapahtuman otsikko ruotsiksi/i,
      });
    case 'shortDescriptionFi':
      return screen.findByRole('textbox', {
        name: /lyhyt kuvaus suomeksi/i,
      });
    case 'shortDescriptionSv':
      return screen.findByRole('textbox', {
        name: /lyhyt kuvaus ruotsiksi/i,
      });
    case 'svButton':
      return screen.findByRole('link', {
        name: /ruotsi/i,
      });
  }
};

test('should show description form section fields', async () => {
  renderComponent();

  await findComponent('nameFi');
  await findComponent('infoUrlFi');
  await findComponent('shortDescriptionFi');
  await findComponent('descriptionFi');
});

test('should change form section language', async () => {
  renderComponent();

  userEvent.click(
    screen.getByRole('link', { name: translations.form.language.sv })
  );

  await findComponent('nameSv');
  await findComponent('infoUrlSv');
  await findComponent('shortDescriptionSv');
  await findComponent('descriptionSv');
});

// eslint-disable-next-line max-len
test('should change selected language when current selected language is removed from event info languages', async () => {
  const { rerender } = renderComponent({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
      EVENT_INFO_LANGUAGES.FI,
      EVENT_INFO_LANGUAGES.SV,
    ],
  });

  const fiButton = await findComponent('fiButton');
  const svButton = await findComponent('svButton');

  expect(fiButton).toBeInTheDocument();
  expect(svButton).toBeInTheDocument();
  expect(fiButton.getAttribute('aria-current')).toBe('step');
  expect(svButton.getAttribute('aria-current')).toBe('false');

  rerender({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [EVENT_INFO_LANGUAGES.SV],
  });

  expect(fiButton).not.toBeInTheDocument();
  expect(svButton).toBeInTheDocument();
  expect(svButton.getAttribute('aria-current')).toBe('step');
});
