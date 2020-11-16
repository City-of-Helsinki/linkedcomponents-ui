import { Formik } from 'formik';
import React from 'react';

import { render, screen } from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import SocialMediaSection from '../SocialMediaSection';

const type = EVENT_TYPE.EVENT;

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.FACEBOOK_URL]: '',
        [EVENT_FIELDS.INSTAGRAM_URL]: '',
        [EVENT_FIELDS.TYPE]: type,
        [EVENT_FIELDS.TWITTER_URL]: '',
      }}
      onSubmit={jest.fn()}
    >
      <SocialMediaSection />
    </Formik>
  );

test('should render social media section', () => {
  renderComponent();

  //  Notification title is same as section title
  expect(
    screen.queryAllByRole('heading', {
      name: translations.event.form.titleSocialMedia[type],
    })
  ).toHaveLength(2);

  const texts = [translations.event.form.infoTextSocialMedia[type]];

  texts.forEach((text) => {
    expect(screen.queryByText(text)).toBeInTheDocument();
  });

  const fields = [
    translations.event.form.placeholderFacebookUrl[type],
    translations.event.form.placeholderInstagramUrl[type],
    translations.event.form.placeholderTwitterUrl[type],
  ];

  fields.forEach((name) => {
    screen.queryByRole('textbox', { name });
  });
});
