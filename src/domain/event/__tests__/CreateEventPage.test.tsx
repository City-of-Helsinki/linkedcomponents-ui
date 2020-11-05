import React from 'react';

import { LanguagesDocument, PlacesDocument } from '../../../generated/graphql';
import { fakeLanguages, fakePlaces } from '../../../utils/mockDataUtils';
import { actWait, render, screen } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import CreateEventPage from '../CreateEventPage';

const languages = fakeLanguages(10);
const languagesResponse = { data: { languages } };

const places = fakePlaces(10);
const placesResponse = { data: { places } };

const placesVariables = {
  createPath: undefined,
  text: '',
};

const mocks = [
  {
    request: {
      query: LanguagesDocument,
    },
    result: languagesResponse,
  },
  {
    request: {
      query: PlacesDocument,
      variables: placesVariables,
    },
    result: placesResponse,
  },
];

test('should show correct title', async () => {
  render(<CreateEventPage />, { mocks });

  await actWait(300);

  const title = document.title;

  expect(title).toBe(
    `${translations.createEventPage.pageTitle.event} - ${translations.appName}`
  );
  expect(
    screen.getByRole('heading', {
      name: translations.createEventPage.title.event,
    })
  ).toBeInTheDocument();
});
