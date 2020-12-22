import { Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import { INCLUDE, KEYWORD_SETS } from '../../../../../constants';
import { KeywordSetDocument } from '../../../../../generated/graphql';
import {
  fakeKeywords,
  fakeKeywordSet,
} from '../../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import AudienceSection from '../AudienceSection';

const type = EVENT_TYPE.EVENT;

const keywordNames = range(1, 16).map((index) => `Keyword ${index}`);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name) => ({ name: { fi: name } }))
).data;

const audiencesKeywordSet = fakeKeywordSet({
  keywords,
});

const audiencesKeywordSetResponse = {
  data: { keywordSet: audiencesKeywordSet },
};

const mocks = [
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
];

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.AUDIENCE]: [],
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
    >
      <AudienceSection />
    </Formik>,
    { mocks }
  );

test('should render audience section', async () => {
  renderComponent();

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', {
        name: translations.event.form.titleAudience,
      })
    ).toBeInTheDocument();
  });

  expect(
    screen.queryByText(translations.event.form.infoTextAudience[type])
  ).toBeInTheDocument();
});

test('should show 10 first audiences by default and rest by clicking show more', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByLabelText(keywordNames[0])).toBeInTheDocument();
  });
  const defaultKeywords = keywordNames.slice(0, 10);
  const restKeywords = keywordNames.slice(10);

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
