import { Formik } from 'formik';
import React from 'react';

import { LE_DATA_LANGUAGES } from '../../../../../constants';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { publicEventSchema } from '../../../utils';
import PriceSection from '../PriceSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const renderTimeSection = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
        [EVENT_FIELDS.HAS_PRICE]: false,
        [EVENT_FIELDS.OFFERS]: [],
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={jest.fn()}
      validationSchema={publicEventSchema}
    >
      <PriceSection />
    </Formik>
  );

const findElement = (key: 'addButton') => {
  switch (key) {
    case 'addButton':
      return screen.findByRole('button', {
        name: /lisää hintatieto/i,
      });
  }
};

const getElement = (
  key: 'addButton' | 'deleteButton' | 'hasPriceCheckbox' | 'heading'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', {
        name: /lisää hintatieto/i,
      });
    case 'deleteButton':
      return screen.getByRole('button', {
        name: translations.event.form.buttonDeleteOffer,
      });
    case 'hasPriceCheckbox':
      return screen.getByRole('checkbox', {
        name: /tapahtuma on maksullinen/i,
      });
    case 'heading':
      return screen.getByRole('heading', {
        name: /tapahtuman hintatiedot/i,
      });
  }
};

test('should add and delete an offer', async () => {
  renderTimeSection();

  getElement('heading');

  userEvent.click(getElement('hasPriceCheckbox'));
  const addButton = await findElement('addButton');
  act(() => userEvent.click(addButton));

  const placeholders = [
    /syötä tapahtuman hinta/i,
    /syötä lipunmyynnin tai ilmoittautumisen url/i,
    /syötä lisätietoa hinnasta/i,
  ];

  await screen.findByPlaceholderText(placeholders[0]);
  for (const placeholder of placeholders.slice(1)) {
    screen.getByPlaceholderText(placeholder);
  }

  userEvent.click(getElement('deleteButton'));

  await waitFor(() =>
    expect(
      screen.queryByPlaceholderText(placeholders[0])
    ).not.toBeInTheDocument()
  );
});

test('should validate an offer', async () => {
  renderTimeSection();

  getElement('heading');

  userEvent.click(getElement('hasPriceCheckbox'));
  const addButton = await findElement('addButton');
  act(() => userEvent.click(addButton));

  const priceInput = await screen.findByPlaceholderText(
    /syötä tapahtuman hinta/i
  );
  const urlInput = screen.getByPlaceholderText(
    /syötä lipunmyynnin tai ilmoittautumisen url/i
  );
  const descriptionInput = screen.getByPlaceholderText(
    /syötä lisätietoa hinnasta/i
  );
  userEvent.click(priceInput);
  userEvent.click(urlInput);
  await screen.findByText(/tämä kenttä on pakollinen/i);

  userEvent.type(urlInput, 'invalidurl.com');
  userEvent.click(descriptionInput);
  await screen.findByText(
    /kirjoita url osoite kokonaisena ja oikeassa muodossa/i
  );
});

test('should show instructions only once', async () => {
  renderTimeSection();

  getElement('heading');

  expect(
    screen.queryAllByText(/merkitse onko tapahtuma maksuton/i)
  ).toHaveLength(0);

  userEvent.click(getElement('hasPriceCheckbox'));
  const addButton = await findElement('addButton');
  act(() => userEvent.click(addButton));

  await waitFor(() =>
    expect(
      screen.queryAllByPlaceholderText(/syötä tapahtuman hinta/i)
    ).toHaveLength(1)
  );

  expect(
    screen.queryAllByText(/merkitse onko tapahtuma maksuton/i)
  ).toHaveLength(1);

  act(() => userEvent.click(addButton));

  await waitFor(() =>
    expect(
      screen.queryAllByPlaceholderText(/syötä tapahtuman hinta/i)
    ).toHaveLength(2)
  );

  expect(
    screen.queryAllByText(/merkitse onko tapahtuma maksuton/i)
  ).toHaveLength(1);
});
