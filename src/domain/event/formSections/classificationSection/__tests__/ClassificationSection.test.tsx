import { Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import {
  mockedAudienceKeywordSetResponse,
  mockedLanguagesResponse,
} from '../../../__mocks__/editEventPage';
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
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import ClassificationSection from '../ClassificationSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.EVENT;

const keywordNames = range(1, 16).map((index) => `Keyword ${index}`);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name, index) => ({
    id: `${index + 1}`,
    atId: `https://api.hel.fi/linkedevents-test/v1/keyword/${index + 1}/`,
    name: { fi: name },
  }))
);

const keywordsResponse = { data: { keywords } };

const keywordsVariables = {
  createPath: undefined,
  dataSource: 'yso',
  showAllKeywords: true,
  text: '',
};

const keyword = keywords.data[0];
const keywordName = keyword.name.fi;
const keywordId = keyword.id;
const keywordAtId = keyword.atId;

const keywordResponse = { data: { keyword } };

const topicsKeywordSet = fakeKeywordSet({
  keywords: keywords.data,
});

const topicsKeywordSetResponse = {
  data: { keywordSet: topicsKeywordSet },
};

const mocks = [
  {
    request: {
      query: KeywordDocument,
      variables: { id: keywordId, createPath: undefined },
    },
    result: keywordResponse,
  },
  {
    request: {
      query: KeywordsDocument,
      variables: keywordsVariables,
    },
    result: keywordsResponse,
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
  mockedAudienceKeywordSetResponse,
  mockedLanguagesResponse,
];

type InitialValues = {
  [EVENT_FIELDS.KEYWORDS]: string[];
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.KEYWORDS]: [],
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

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', {
        name: translations.event.form.titleMainCategories,
      })
    );
  });

  expect(
    screen.queryByRole('heading', {
      name: translations.event.form.notificationTitleMainCategories[type],
    })
  );

  expect(
    screen.queryAllByRole('heading', {
      name: translations.event.form.titleKeywords,
    })
  ).toHaveLength(2);

  const infoTexts = [
    translations.event.form.infoTextMainCategories[type],
    translations.event.form.infoTextKeywords[type],
  ];

  infoTexts.forEach((infoText) => {
    expect(screen.queryByText(infoText));
  });

  await waitFor(() => {
    expect(
      screen.queryByRole('link', {
        name: new RegExp(keywordName, 'i'),
        hidden: true,
      })
    ).toBeInTheDocument();
  });
});

test('should show 10 first topics by default and rest by clicking show more', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByLabelText(keywordNames[0])).toBeInTheDocument();
  });
  const defaultKeywords = [...keywordNames].sort().slice(0, 10);
  const restKeywords = [...keywordNames].sort().slice(10);

  defaultKeywords.forEach((keyword) => {
    expect(screen.queryByLabelText(keyword)).toBeInTheDocument();
  });

  restKeywords.forEach((keyword) => {
    expect(screen.queryByLabelText(keyword)).not.toBeInTheDocument();
  });

  userEvent.click(
    screen.getByRole('button', { name: translations.common.showMore })
  );

  await waitFor(() => {
    expect(screen.queryByLabelText(restKeywords[0])).toBeInTheDocument();
  });

  restKeywords.forEach((keyword) => {
    expect(screen.queryByLabelText(keyword)).toBeInTheDocument();
  });
});

test('should change keyword', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByLabelText(keywordNames[0])).toBeInTheDocument();
  });

  const toggleButton = screen.queryByRole('button', {
    name: `${translations.event.form.labelKeywords}: ${translations.common.combobox.toggleButtonAriaLabel}`,
  });

  userEvent.click(toggleButton);

  await waitFor(() => {
    expect(
      screen.getByRole('option', { name: keywordName })
    ).toBeInTheDocument();
  });

  userEvent.click(screen.getByRole('option', { name: keywordName }));

  await waitFor(() => {
    expect(
      screen.queryByRole('link', {
        name: new RegExp(keywordName, 'i'),
        hidden: true,
      })
    ).toBeInTheDocument();
  });
});
