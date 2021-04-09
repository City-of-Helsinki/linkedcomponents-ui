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

const type = EVENT_TYPE.EVENT;

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
          EVENT_INFO_LANGUAGES.FI,
          EVENT_INFO_LANGUAGES.EN,
        ],
        [EVENT_FIELDS.INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
        [EVENT_FIELDS.FACEBOOK_URL]: '',
        [EVENT_FIELDS.INSTAGRAM_URL]: '',
        [EVENT_FIELDS.TYPE]: type,
        [EVENT_FIELDS.TWITTER_URL]: '',
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

  texts.forEach((text) => {
    expect(screen.queryByText(text)).toBeInTheDocument();
  });

  const fields = [
    'Kurssin kotisivun URL suomeksi',
    'Kurssin kotisivun URL englanniksi',
    translations.event.form.placeholderFacebookUrl[type],
    translations.event.form.placeholderInstagramUrl[type],
    translations.event.form.placeholderTwitterUrl[type],
  ];

  fields.forEach((name) => {
    screen.queryByRole('textbox', { name });
  });
});
