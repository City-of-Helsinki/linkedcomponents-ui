import { Formik } from 'formik';
import React from 'react';

import { LE_DATA_LANGUAGES } from '../../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { getEmptyOffer } from '../../../utils';
import { publicEventSchema } from '../../../validation';
import PriceSection from '../PriceSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const renderPriceSection = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
        [EVENT_FIELDS.HAS_PRICE]: false,
        [EVENT_FIELDS.OFFERS]: [getEmptyOffer()],
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={jest.fn()}
      validationSchema={publicEventSchema}
    >
      <PriceSection isEditingAllowed={true} />
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

const queryElements = (
  key: 'deleteButtons' | 'instructions' | 'priceInputs'
) => {
  switch (key) {
    case 'deleteButtons':
      return screen.queryAllByRole('button', {
        name: 'Poista hintatieto',
      });
    case 'instructions':
      return screen.queryAllByText(/merkitse onko tapahtuma maksuton/i);
    case 'priceInputs':
      return screen.queryAllByPlaceholderText(/syötä tapahtuman hinta/i);
  }
};

const getElement = (key: 'hasPriceCheckbox' | 'heading') => {
  switch (key) {
    case 'hasPriceCheckbox':
      return screen.getByLabelText(/tapahtuma on maksullinen/i);
    case 'heading':
      return screen.getByRole('heading', {
        name: /tapahtuman hintatiedot/i,
      });
  }
};

test('should add and delete an offer', async () => {
  const user = userEvent.setup();
  renderPriceSection();

  await user.click(getElement('hasPriceCheckbox'));

  const placeholders = [
    /syötä tapahtuman hinta/i,
    /syötä lipunmyynnin tai ilmoittautumisen url/i,
    /syötä lisätietoa hinnasta/i,
  ];

  await waitFor(() =>
    expect(screen.queryAllByPlaceholderText(placeholders[0])).toHaveLength(1)
  );
  for (const placeholder of placeholders.slice(1)) {
    screen.getByPlaceholderText(placeholder);
  }

  const addButton = await findElement('addButton');
  await user.click(addButton);

  await waitFor(() =>
    expect(screen.queryAllByPlaceholderText(placeholders[0])).toHaveLength(2)
  );

  const deleteButton = queryElements('deleteButtons')[0];
  await user.click(deleteButton);

  await waitFor(() =>
    expect(screen.queryAllByPlaceholderText(placeholders[0])).toHaveLength(1)
  );
});

test('should validate an offer', async () => {
  const user = userEvent.setup();
  renderPriceSection();

  await user.click(getElement('hasPriceCheckbox'));

  const priceInput = await screen.findByPlaceholderText(
    /syötä tapahtuman hinta/i
  );
  const urlInput = screen.getByPlaceholderText(
    /syötä lipunmyynnin tai ilmoittautumisen url/i
  );
  const descriptionInput = screen.getByPlaceholderText(
    /syötä lisätietoa hinnasta/i
  );
  await user.click(priceInput);
  await user.click(urlInput);
  await screen.findByText(/tämä kenttä on pakollinen/i);

  await user.type(urlInput, 'invalidurl.com');
  await user.click(descriptionInput);
  await screen.findByText(
    /kirjoita url osoite kokonaisena ja oikeassa muodossa/i
  );
});

test('should show instructions only once', async () => {
  const user = userEvent.setup();
  renderPriceSection();

  getElement('heading');

  // Should be instructions to free event
  expect(queryElements('instructions')).toHaveLength(1);

  await user.click(getElement('hasPriceCheckbox'));

  await waitFor(() => expect(queryElements('priceInputs')).toHaveLength(1));

  const addButton = await findElement('addButton');
  await user.click(addButton);

  await waitFor(() => expect(queryElements('priceInputs')).toHaveLength(2));
  expect(queryElements('instructions')).toHaveLength(1);
});
