import { Formik } from 'formik';
import React from 'react';

import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import { render, screen, userEvent } from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import { createEventValidationSchema } from '../../../utils';
import PriceSection from '../PriceSection';

const type = EVENT_TYPE.EVENT;

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
      validationSchema={createEventValidationSchema}
    >
      <PriceSection />
    </Formik>
  );

test('should add and delete an offer', () => {
  renderTimeSection();

  expect(
    screen.queryByRole('heading', {
      name: translations.event.form.titlePriceInfo[type],
    })
  ).toBeInTheDocument();

  userEvent.click(
    screen.getByRole('checkbox', {
      name: translations.event.form.labelHasPrice[type],
    })
  );

  const addButton = screen.getByRole('button', {
    name: translations.event.form.buttonAddOffer,
  });

  expect(addButton).toBeInTheDocument();

  userEvent.click(addButton);

  const langText = lowerCaseFirstLetter(translations.form.inLanguage.fi);
  const placeholders = [
    translations.event.form.placeholderOfferPrice[type].replace(
      '{{langText}}',
      langText
    ),
    translations.event.form.placeholderOfferInfoUrl.replace(
      '{{langText}}',
      langText
    ),
    translations.event.form.placeholderOfferDescription.replace(
      '{{langText}}',
      langText
    ),
  ];

  placeholders.forEach((placeholder) => {
    expect(screen.queryByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  const deleteButton = screen.getByRole('button', {
    name: translations.event.form.buttonDeleteOffer,
  });

  expect(deleteButton).toBeInTheDocument();

  userEvent.click(deleteButton);

  placeholders.forEach((placeholder) => {
    expect(screen.queryByPlaceholderText(placeholder)).not.toBeInTheDocument();
  });
});
