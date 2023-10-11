import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { mockedTopicsKeywordSetResponse } from '../../../../keywordSet/__mocks__/keywordSets';
import { mockedLanguagesResponse } from '../../../../language/__mocks__/language';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import {
  audienceNames,
  mockedAudiencesKeywordSetResponse,
} from '../__mocks__/audienceSection';
import AudienceSection from '../AudienceSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const mocks = [
  mockedAudiencesKeywordSetResponse,
  mockedLanguagesResponse,
  mockedTopicsKeywordSetResponse,
];

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.AUDIENCE]: [],
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={vi.fn()}
      enableReinitialize={true}
    >
      <AudienceSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );

test('should render audience section', async () => {
  renderComponent();

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: /kohderyhmät/i })
    ).toBeInTheDocument();
  });

  expect(
    screen.queryByText(translations.event.form.infoTextAudience[type])
  ).toBeInTheDocument();
});

test('should show 10 first audiences by default and rest by clicking show more', async () => {
  const user = userEvent.setup();
  renderComponent();

  const sortedAudienceNames = audienceNames
    .slice()
    .sort((a, b) => a.localeCompare(b, 'en'));

  await waitFor(() => {
    expect(screen.queryByLabelText(sortedAudienceNames[0])).toBeInTheDocument();
  });
  const defaultKeywords = sortedAudienceNames.slice(0, 10);
  const restKeywords = sortedAudienceNames.slice(10);

  defaultKeywords.forEach((keyword) => {
    expect(screen.queryByLabelText(keyword)).toBeInTheDocument();
  });

  restKeywords.forEach((keyword) => {
    expect(screen.queryByLabelText(keyword)).not.toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: /näytä lisää/i }));

  await waitFor(() => {
    expect(screen.queryByLabelText(restKeywords[0])).toBeInTheDocument();
  });

  restKeywords.forEach((keyword) => {
    expect(screen.queryByLabelText(keyword)).toBeInTheDocument();
  });
});
