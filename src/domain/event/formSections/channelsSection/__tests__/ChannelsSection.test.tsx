import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import { publicEventSchema } from '../../../utils';
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
      validationSchema={publicEventSchema}
    >
      <ChannelsSection />
    </Formik>
  );

test('should render social media section', () => {
  renderComponent();

  screen.getByRole('heading', { name: /Tapahtuman kotisivu/i });
  //  Notification title is same as section title
  expect(
    screen.getAllByRole('heading', {
      name: /Tapahtuma sosiaalisessa mediassa/i,
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

test('should add and remove some link', async () => {
  renderComponent();

  expect(
    screen.queryByRole('button', { name: /Poista SoMe-linkki/i })
  ).not.toBeInTheDocument();

  const toggleButton = screen.getByRole('button', {
    name: /uuden some-linkin tyyppi/i,
  });
  userEvent.click(toggleButton);
  const facebookOption = screen.getByRole('option', { name: /facebook/i });
  userEvent.click(facebookOption);

  const deleteButton = await screen.findByRole('button', {
    name: /Poista SoMe-linkki/i,
  });
  userEvent.click(deleteButton);

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: /Poista SoMe-linkki/i })
    ).not.toBeInTheDocument()
  );
});

test('should show validation error if some link url is empty', async () => {
  renderComponent();

  expect(
    screen.queryByRole('button', { name: /Poista SoMe-linkki/i })
  ).not.toBeInTheDocument();

  const toggleButton = screen.getByRole('button', {
    name: /uuden some-linkin tyyppi/i,
  });
  userEvent.click(toggleButton);
  const facebookOption = screen.getByRole('option', { name: /facebook/i });
  userEvent.click(facebookOption);

  const facebookLinkInput = await screen.findByRole('textbox', {
    name: /tapahtuman facebook url \*/i,
  });
  userEvent.click(facebookLinkInput);

  userEvent.click(toggleButton);
  await screen.findByText(/Tämä kenttä on pakollinen/i);
});

test('should show validation error if some link url is invalid', async () => {
  renderComponent();

  expect(
    screen.queryByRole('button', { name: /Poista SoMe-linkki/i })
  ).not.toBeInTheDocument();

  const toggleButton = screen.getByRole('button', {
    name: /uuden some-linkin tyyppi/i,
  });
  userEvent.click(toggleButton);
  const facebookOption = screen.getByRole('option', { name: /facebook/i });
  userEvent.click(facebookOption);

  const facebookLinkInput = await screen.findByRole('textbox', {
    name: /tapahtuman facebook url \*/i,
  });
  userEvent.click(facebookLinkInput);
  userEvent.type(facebookLinkInput, 'invalid url');

  userEvent.click(toggleButton);
  await screen.findByText(
    /Kirjoita URL osoite kokonaisena ja oikeassa muodossa/i
  );
});
