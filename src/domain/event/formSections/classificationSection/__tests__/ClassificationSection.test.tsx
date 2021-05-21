import { Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import { INCLUDE, KEYWORD_SETS } from '../../../../../constants';
import {
  KeywordDocument,
  KeywordsDocument,
  KeywordSetDocument,
} from '../../../../../generated/graphql';
import {
  fakeKeywords,
  fakeKeywordSet,
} from '../../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { cache } from '../../../../app/apollo/apolloClient';
import translations from '../../../../app/i18n/fi.json';
import {
  mockedAudienceKeywordSetResponse,
  mockedLanguagesResponse,
} from '../../../__mocks__/editEventPage';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import ClassificationSection from '../ClassificationSection';

configure({ defaultHidden: true });
afterEach(() => cache.reset());

const type = EVENT_TYPE.General;

const keywordNames = range(1, 16).map((index) => `Keyword ${index}`);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name, index) => ({
    id: `${index + 1}`,
    atId: `https://api.hel.fi/linkedevents-test/v1/keyword/${index + 1}/`,
    name: { fi: name },
  }))
);
const keywordsVariables = {
  createPath: undefined,
  dataSource: 'yso',
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = { data: { keywords } };
const mockedKeywordsResponse = {
  request: {
    query: KeywordsDocument,
    variables: keywordsVariables,
  },
  result: keywordsResponse,
};

const keyword = keywords.data[0];
const keywordName = keyword.name.fi;
const keywordId = keyword.id;
const keywordAtId = keyword.atId;
const keywordVariables = { id: keywordId, createPath: undefined };
const keywordResponse = { data: { keyword } };
const mockedKeywordResponse = {
  request: {
    query: KeywordDocument,
    variables: keywordVariables,
  },
  result: keywordResponse,
};

const topicsKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.TOPICS,
  keywords: keywords.data,
});
const topicsKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.TOPICS,
  include: [INCLUDE.KEYWORDS],
};
const topicsKeywordSetResponse = {
  data: { keywordSet: topicsKeywordSet },
};
const mockedTopicsKeywordSetResponse = {
  request: {
    query: KeywordSetDocument,
    variables: topicsKeywordSetVariables,
  },
  result: topicsKeywordSetResponse,
};

const mocks = [
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedTopicsKeywordSetResponse,
  mockedAudienceKeywordSetResponse,
  mockedLanguagesResponse,
];

type InitialValues = {
  [EVENT_FIELDS.KEYWORDS]: string[];
  [EVENT_FIELDS.MAIN_CATEGORIES]: string[];
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.KEYWORDS]: [],
  [EVENT_FIELDS.MAIN_CATEGORIES]: [],
  [EVENT_FIELDS.TYPE]: type,
};
const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
    >
      <ClassificationSection />
    </Formik>,
    { mocks }
  );

test('should render classification section', async () => {
  renderComponent({ [EVENT_FIELDS.KEYWORDS]: [keywordAtId] });

  await screen.findByRole('heading', {
    name: translations.event.form.titleMainCategories,
  });

  screen.getByRole('heading', {
    name: translations.event.form.notificationTitleMainCategories[type],
  });

  expect(
    screen.getAllByRole('heading', {
      name: translations.event.form.titleKeywords,
    })
  ).toHaveLength(2);

  const infoTexts = [
    translations.event.form.infoTextMainCategories[type],
    translations.event.form.infoTextKeywords[type],
  ];

  infoTexts.forEach((infoText) => screen.getByText(infoText));

  await screen.findByRole('link', {
    name: new RegExp(keywordName, 'i'),
    hidden: true,
  });
});

test('should show 10 first topics by default and rest by clicking show more', async () => {
  renderComponent();

  await screen.findByLabelText(keywordNames[0]);

  const defaultKeywords = [...keywordNames].sort().slice(0, 10);
  const restKeywords = [...keywordNames].sort().slice(10);

  defaultKeywords.forEach((keyword) => screen.getByLabelText(keyword));

  restKeywords.forEach((keyword) =>
    expect(screen.queryByLabelText(keyword)).not.toBeInTheDocument()
  );

  userEvent.click(
    screen.getByRole('button', { name: translations.common.showMore })
  );

  await screen.findByLabelText(restKeywords[0]);

  restKeywords.forEach((keyword) => screen.getByLabelText(keyword));
});

test('should change keyword', async () => {
  renderComponent();

  await screen.findByLabelText(keywordNames[0]);

  const toggleButton = screen.queryByRole('button', {
    name: `${translations.event.form.labelKeywords}: ${translations.common.combobox.toggleButtonAriaLabel}`,
  });

  userEvent.click(toggleButton);

  await screen.findByRole('option', { name: keywordName });

  userEvent.click(screen.getByRole('option', { name: keywordName }));

  await screen.findByRole('link', {
    name: new RegExp(keywordName, 'i'),
    hidden: true,
  });
});
