import { Formik } from 'formik';
import React from 'react';

import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import { publicEventSchema } from '../../../utils';
import PriceSection from '../PriceSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const renderTimeSection = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [EVENT_INFO_LANGUAGES.FI],
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

test('should add and delete an offer', async () => {
  renderTimeSection();

  screen.getByRole('heading', {
    name: translations.event.form.titlePriceInfo[type],
  });

  userEvent.click(
    screen.getByRole('checkbox', {
      name: translations.event.form.labelHasPrice[type],
    })
  );

  const addButton = screen.getByRole('button', {
    name: translations.event.form.buttonAddOffer,
  });
  userEvent.click(addButton);

  const langText = lowerCaseFirstLetter(translations.form.inLanguage.fi);
  const placeholders = [
    translations.event.form.placeholderOfferPrice[type],
    translations.event.form.placeholderOfferInfoUrl,
    translations.event.form.placeholderOfferDescription,
  ].map((text) => text.replace('{{langText}}', langText));

  placeholders.forEach((placeholder) =>
    screen.getByPlaceholderText(placeholder)
  );

  const deleteButton = screen.getByRole('button', {
    name: translations.event.form.buttonDeleteOffer,
  });
  userEvent.click(deleteButton);

  await waitFor(() =>
    expect(
      screen.queryByPlaceholderText(placeholders[0])
    ).not.toBeInTheDocument()
  );
});
