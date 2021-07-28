import { Formik } from 'formik';
import React from 'react';

import { configure, render, screen } from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import ChannelsSection from '../ChannelsSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
          EVENT_INFO_LANGUAGES.FI,
          EVENT_INFO_LANGUAGES.EN,
        ],
        [EVENT_FIELDS.INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
        [EVENT_FIELDS.EXTERNAL_LINKS]: [],
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={jest.fn()}
    >
      <ChannelsSection />
    </Formik>
  );

test('should render social media section', () => {
  renderComponent();

  screen.getByRole('heading', {
    name: translations.event.form.titleInfoUrl[type],
  });
  //  Notification title is same as section title
  expect(
    screen.getAllByRole('heading', {
      name: translations.event.form.titleSocialMedia[type],
    })
  ).toHaveLength(2);

  const texts = [translations.event.form.infoTextSocialMedia[type]];

  texts.forEach((text) => screen.getByText(text));

  const fields = [
    'Tapahtuman kotisivun URL suomeksi',
    'Tapahtuman kotisivun URL englanniksi',
  ];
  fields.forEach((name) => screen.getByRole('textbox', { name }));

  screen.getByRole('button', { name: /SoMe-linkin tyyppi/i });
});
