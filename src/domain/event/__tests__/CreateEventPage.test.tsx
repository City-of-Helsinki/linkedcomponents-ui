import React from 'react';

import { INCLUDE, KEYWORD_SETS } from '../../../constants';
import {
  KeywordsDocument,
  KeywordSetDocument,
  LanguagesDocument,
  PlacesDocument,
} from '../../../generated/graphql';
import {
  fakeKeywords,
  fakeKeywordSet,
  fakeLanguages,
  fakePlaces,
} from '../../../utils/mockDataUtils';
import { actWait, render, screen } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import CreateEventPage from '../CreateEventPage';

const keywords = fakeKeywords(1);
const keywordsResponse = {
  data: { keywords },
};

const audiencesKeywordSet = fakeKeywordSet();
const audiencesKeywordSetResponse = {
  data: { keywordSet: audiencesKeywordSet },
};

const topicsKeywordSet = fakeKeywordSet();
const topicsKeywordSetResponse = { data: { keywordSet: topicsKeywordSet } };

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
      query: KeywordsDocument,
      variables: {
        createPath: undefined,
        freeText: '',
      },
    },
    result: keywordsResponse,
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: {
        createPath: undefined,
        id: KEYWORD_SETS.AUDIENCES,
        include: [INCLUDE.KEYWORDS],
      },
    },
    result: audiencesKeywordSetResponse,
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: {
        createPath: undefined,
        id: KEYWORD_SETS.TOPICS,
        include: [INCLUDE.KEYWORDS],
      },
    },
    result: topicsKeywordSetResponse,
  },
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
