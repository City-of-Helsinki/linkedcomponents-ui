import { Formik } from 'formik';
import React from 'react';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
} from '../../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { publicEventSchema } from '../../../validation';
import ChannelsSection from '../ChannelsSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
          LE_DATA_LANGUAGES.FI,
          LE_DATA_LANGUAGES.EN,
        ],
        [EVENT_FIELDS.INFO_URL]: EMPTY_MULTI_LANGUAGE_OBJECT,
        [EVENT_FIELDS.EXTERNAL_LINKS]: [],
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={jest.fn()}
      validationSchema={publicEventSchema}
    >
      <ChannelsSection isEditingAllowed={true} />
    </Formik>
  );

const findElements = (key: 'deleteButtons' | 'facebookLinks') => {
  switch (key) {
    case 'deleteButtons':
      return screen.findAllByRole('button', {
        name: /Poista SoMe-linkki/i,
      });
    case 'facebookLinks':
      return screen.findAllByRole('textbox', {
        name: /tapahtuman facebook url \*/i,
      });
  }
};

const getElement = (key: 'facebookOption' | 'toggleButton') => {
  switch (key) {
    case 'facebookOption':
      return screen.getByRole('option', { name: /facebook/i });
    case 'toggleButton':
      return screen.getByRole('button', { name: /uuden some-linkin tyyppi/i });
  }
};

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

  getElement('toggleButton');
});

test('should add and remove some link', async () => {
  const user = userEvent.setup();
  renderComponent();

  expect(
    screen.queryByRole('button', { name: /Poista SoMe-linkki/i })
  ).not.toBeInTheDocument();

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);
  const facebookOption = getElement('facebookOption');
  await user.click(facebookOption);

  const deleteButtons = await findElements('deleteButtons');
  for (const deleteButton of deleteButtons.reverse()) {
    await user.click(deleteButton);
  }

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: /Poista SoMe-linkki/i })
    ).not.toBeInTheDocument()
  );
});

test('should show validation error if some link url is empty', async () => {
  const user = userEvent.setup();
  await renderComponent();

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);
  const facebookOption = getElement('facebookOption');
  await user.click(facebookOption);

  const facebookLinks = await findElements('facebookLinks');
  await user.click(facebookLinks[0]);

  await user.click(toggleButton);
  await screen.findByText(/Tämä kenttä on pakollinen/i);
});

test('should show validation error if some link url is invalid', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);
  const facebookOption = getElement('facebookOption');
  await user.click(facebookOption);

  const facebookLinks = await findElements('facebookLinks');
  await user.click(facebookLinks[0]);
  await user.type(facebookLinks[0], 'invalid url');

  await user.click(toggleButton);
  await screen.findByText(
    /Kirjoita URL osoite kokonaisena ja oikeassa muodossa/i
  );
});
