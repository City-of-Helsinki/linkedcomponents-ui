import { Formik } from 'formik';

import {
  configure,
  render,
  screen,
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

test('should show all audience options', async () => {
  renderComponent();

  const sortedAudienceNames = audienceNames
    .slice()
    .sort((a, b) => a.localeCompare(b, 'en'));

  for (const keyword of sortedAudienceNames) {
    expect(await screen.findByLabelText(keyword)).toBeInTheDocument();
  }
});
