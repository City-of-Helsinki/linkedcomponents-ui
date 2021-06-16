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
  waitFor,
} from '../../../../../utils/testUtils';
import {
  REMOTE_PARTICIPATION_KEYWORD,
  REMOTE_PARTICIPATION_KEYWORD_ID,
} from '../../../../keyword/constants';
import { INTERNET_PLACE_ID } from '../../../../place/constants';
import {
  mockedAudienceKeywordSetResponse,
  mockedLanguagesResponse,
} from '../../../__mocks__/editEventPage';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { publicEventSchema } from '../../../utils';
import ClassificationSection from '../ClassificationSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;
const removeParticipationName = 'Etäosallistuminen';

const keywordNames = range(1, 16).map((index) => `Keyword ${index}`);
const keywords = fakeKeywords(keywordNames.length + 1, [
  {
    id: REMOTE_PARTICIPATION_KEYWORD_ID,
    atId: REMOTE_PARTICIPATION_KEYWORD,
    name: { fi: removeParticipationName },
  },
  ...keywordNames.map((name, index) => ({
    id: `${index + 1}`,
    name: { fi: name },
  })),
]);
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
const keywordVariables = { id: keyword.id, createPath: undefined };
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
  [EVENT_FIELDS.LOCATION]: string;
  [EVENT_FIELDS.MAIN_CATEGORIES]: string[];
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.KEYWORDS]: [],
  [EVENT_FIELDS.LOCATION]: '',
  [EVENT_FIELDS.MAIN_CATEGORIES]: [],
  [EVENT_FIELDS.TYPE]: type,
};
const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={publicEventSchema}
    >
      <ClassificationSection />
    </Formik>,
    { mocks }
  );

const findElement = (key: 'keywordLink' | 'keywordOption') => {
  switch (key) {
    case 'keywordLink':
      return screen.findByRole('link', {
        name: new RegExp(keyword.name.fi, 'i'),
        hidden: true,
      });
    case 'keywordOption':
      return screen.findByRole('option', {
        name: keyword.name.fi,
      });
  }
};

const getElement = (
  key:
    | 'infoTextKeywords'
    | 'infoTextMainCategories'
    | 'showMoreButton'
    | 'titleMainCategories'
    | 'titleNotification'
    | 'toggleButton'
) => {
  switch (key) {
    case 'infoTextKeywords':
      return screen.getByText(
        /liitä tapahtumaan vähintään yksi asiasana, joka kuvaa tapahtuman teemaa./i
      );
    case 'infoTextMainCategories':
      return screen.getByText(/valitse vähintään yksi pääluokka/i);
    case 'showMoreButton':
      return screen.getByRole('button', { name: /näytä lisää/i });
    case 'titleMainCategories':
      return screen.getByRole('heading', { name: /pääluokat \(kategoriat\)/i });
    case 'titleNotification':
      return screen.getByRole('heading', { name: /tapahtuman luokittelu/i });
    case 'toggleButton':
      return screen.getByRole('button', { name: /avainsanahaku/i });
  }
};

test('should render classification section', async () => {
  renderComponent({ [EVENT_FIELDS.KEYWORDS]: [keyword.atId] });

  getElement('titleMainCategories');
  getElement('titleNotification');
  expect(
    screen.getAllByRole('heading', { name: /lisää avainsanoja/i })
  ).toHaveLength(2);
  getElement('infoTextMainCategories');
  getElement('infoTextKeywords');

  await findElement('keywordLink');
});

test('should show 10 first topics by default and rest by clicking show more', async () => {
  const sortedKeywords = [...keywordNames, removeParticipationName].sort();
  const defaultKeywords = sortedKeywords.slice(0, 10);
  const restKeywords = [...keywordNames].sort().slice(10);

  renderComponent();

  await screen.findByLabelText(keywordNames[0]);
  defaultKeywords.slice(1).forEach((keyword) => screen.getByLabelText(keyword));
  restKeywords.forEach((keyword) =>
    expect(screen.queryByLabelText(keyword)).not.toBeInTheDocument()
  );

  userEvent.click(getElement('showMoreButton'));

  await screen.findByLabelText(restKeywords[0]);
  restKeywords.slice(1).forEach((keyword) => screen.getByLabelText(keyword));
});

test('should change keyword', async () => {
  renderComponent();

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);

  const keywordOption = await findElement('keywordOption');
  userEvent.click(keywordOption);

  await findElement('keywordLink');
});

test('should show correct validation error if none main category is selected', async () => {
  renderComponent();

  const mainCategoryCheckbox = await screen.findByRole('checkbox', {
    name: keywordNames[0],
  });
  userEvent.click(mainCategoryCheckbox);
  userEvent.click(mainCategoryCheckbox);

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);
  userEvent.tab();

  await screen.findByText('Vähintään 1 pääluokka tulee olla valittuna');
});

test('should select remote participation if internet is selected as a location', async () => {
  renderComponent({ [EVENT_FIELDS.LOCATION]: INTERNET_PLACE_ID });

  const remoteParticipationCheckbox = await screen.findByRole('checkbox', {
    name: removeParticipationName,
  });

  await waitFor(() => expect(remoteParticipationCheckbox).toBeChecked());
  expect(remoteParticipationCheckbox).toBeDisabled();
});

test('should show correct validation error if none keyword is selected', async () => {
  renderComponent();

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);
  userEvent.tab();

  await screen.findByText('Vähintään 1 avainsana tulee olla valittuna');
});
