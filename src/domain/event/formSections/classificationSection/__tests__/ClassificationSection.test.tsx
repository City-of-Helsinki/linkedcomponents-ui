import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';

import getValue from '../../../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../../utils/testUtils';
import {
  educationLevelsKeyword,
  educationModelsKeyword,
  mockedAudienceKeywordSetResponse,
  mockedEducationLevelsKeywordSetResponse,
  mockedEducationModelsKeywordSetResponse,
} from '../../../../keywordSet/__mocks__/keywordSets';
import { mockedLanguagesResponse } from '../../../../language/__mocks__/language';
import { mockedKaskoOrganizationDecendantsResponse } from '../../../../organization/__mocks__/organizationDecendants';
import { INTERNET_PLACE_ID } from '../../../../place/constants';
import {
  mockedKaskoUserResponse,
  mockedUserResponse,
} from '../../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { publicEventSchema } from '../../../validation';
import {
  courseTopicNames,
  eventTopicNames,
  keyword,
  mockedCourseTopicsKeywordSetResponse,
  mockedEventTopicsKeywordSetResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  removeParticipationName,
} from '../__mocks__/classificationSection';
import ClassificationSection from '../ClassificationSection';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const type = EVENT_TYPE.General;

const defaultMocks = [
  mockedEventTopicsKeywordSetResponse,
  mockedCourseTopicsKeywordSetResponse,
  mockedAudienceKeywordSetResponse,
  mockedEducationLevelsKeywordSetResponse,
  mockedEducationModelsKeywordSetResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedLanguagesResponse,
  mockedUserResponse,
];

type InitialValues = {
  [EVENT_FIELDS.KEYWORDS]: string[];
  [EVENT_FIELDS.LOCATION]: string;
  [EVENT_FIELDS.MAIN_CATEGORIES]: string[];
  [EVENT_FIELDS.TYPE]: string;
  [EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES]: boolean;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.KEYWORDS]: [],
  [EVENT_FIELDS.LOCATION]: '',
  [EVENT_FIELDS.MAIN_CATEGORIES]: [],
  [EVENT_FIELDS.TYPE]: type,
  [EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES]: false,
};
const renderComponent = (
  initialValues?: Partial<InitialValues>,
  mocks: MockedResponse[] = defaultMocks
) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={vi.fn()}
      enableReinitialize={true}
      validationSchema={publicEventSchema}
    >
      <ClassificationSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );

const findElement = (
  key:
    | 'keywordText'
    | 'keywordOption'
    | 'educationLevelsKeywordOption'
    | 'educationModelsKeywordOption'
) => {
  switch (key) {
    case 'keywordText':
      return screen.findByText(
        getValue(keyword?.name?.fi, ''),
        { selector: 'span' },
        { timeout: 2000 }
      );
    case 'keywordOption':
      return screen.findByRole('checkbox', {
        name: getValue(keyword?.name?.fi, ''),
      });
    case 'educationLevelsKeywordOption':
      return screen.findByRole('checkbox', {
        name: getValue(educationLevelsKeyword?.name?.fi, ''),
      });
    case 'educationModelsKeywordOption':
      return screen.findByRole('checkbox', {
        name: getValue(educationModelsKeyword?.name?.fi, ''),
      });
  }
};

const getElement = (
  key:
    | 'infoTextKeywords'
    | 'infoTextMainCategories'
    | 'mainCategories'
    | 'titleMainCategories'
    | 'titleNotification'
    | 'titleCrossInstitutionalStudies'
    | 'toggleButton'
) => {
  switch (key) {
    case 'infoTextKeywords':
      return screen.getByText(
        /liitä tapahtumaan vähintään yksi avainsana, joka kuvaa tapahtuman teemaa./i
      );
    case 'infoTextMainCategories':
      return screen.getByText(/valitse vähintään yksi pääluokka/i);
    case 'mainCategories':
      return screen.getByRole('group', { name: /valitse kategoria\(t\)/i });
    case 'titleMainCategories':
      return screen.getByRole('heading', { name: /Valitse kategoria\(t\)/i });
    case 'titleNotification':
      return screen.getByRole('heading', { name: /tapahtuman luokittelu/i });
    case 'titleCrossInstitutionalStudies':
      return screen.getByRole('heading', { name: /toiseen asteen opinnot/i });
    case 'toggleButton':
      return screen.getByRole('button', { name: /avainsanahaku/i });
  }
};

test('should render classification section', async () => {
  renderComponent({
    [EVENT_FIELDS.KEYWORDS]: [getValue(keyword?.atId, '')],
  });

  getElement('titleMainCategories');
  getElement('titleNotification');
  expect(
    screen.getAllByRole('heading', { name: /lisää avainsanoja/i })
  ).toHaveLength(2);
  getElement('infoTextMainCategories');
  getElement('infoTextKeywords');

  await findElement('keywordText');
});

test('should show all topic options', async () => {
  const sortedKeywords = [...eventTopicNames, removeParticipationName].sort();

  renderComponent();

  const mainCategories = getElement('mainCategories');
  await within(mainCategories).findByLabelText(eventTopicNames[0]);

  for (const name of sortedKeywords) {
    within(mainCategories).getByLabelText(name);
  }
});

test('should show course topics', async () => {
  renderComponent({ type: EVENT_TYPE.Course });

  const mainCategories = getElement('mainCategories');
  await within(mainCategories).findByLabelText(courseTopicNames[0]);

  for (const name of courseTopicNames.slice(1)) {
    within(mainCategories).getByLabelText(name);
  }
});

test('should show education fields for kasko user', async () => {
  const mocks = [
    mockedEventTopicsKeywordSetResponse,
    mockedCourseTopicsKeywordSetResponse,
    mockedAudienceKeywordSetResponse,
    mockedEducationLevelsKeywordSetResponse,
    mockedEducationModelsKeywordSetResponse,
    mockedKeywordResponse,
    mockedKeywordsResponse,
    mockedLanguagesResponse,
    mockedKaskoUserResponse,
    mockedKaskoOrganizationDecendantsResponse,
  ];

  renderComponent({ type: EVENT_TYPE.Course }, mocks);

  await waitFor(() => getElement('titleCrossInstitutionalStudies'));
});

test('should change keyword', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);

  const keywordOption = await findElement('keywordOption');
  await user.click(keywordOption);

  expect(
    screen.queryByRole('listbox', { name: /avainsanahaku/i })
  ).not.toBeInTheDocument();
  await findElement('keywordText');
});

test('should show correct validation error if none main category is selected', async () => {
  const user = userEvent.setup();
  renderComponent();

  const mainCategories = getElement('mainCategories');
  const mainCategoryCheckbox = await within(mainCategories).findByLabelText(
    eventTopicNames[0]
  );
  await user.click(mainCategoryCheckbox);
  await user.click(mainCategoryCheckbox);

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);
  await user.tab();

  await screen.findByText('Vähintään 1 pääluokka tulee olla valittuna');
});

test('should select remote participation if internet is selected as a location', async () => {
  renderComponent({ [EVENT_FIELDS.LOCATION]: INTERNET_PLACE_ID });

  const mainCategories = getElement('mainCategories');
  const remoteParticipationCheckbox = await within(
    mainCategories
  ).findByLabelText(removeParticipationName);

  await waitFor(() => expect(remoteParticipationCheckbox).toBeChecked());
  expect(remoteParticipationCheckbox).toBeDisabled();
});

test('should show correct validation error if none keyword is selected', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);
  await user.tab();

  await screen.findByText('Vähintään 1 avainsana tulee olla valittuna');
});

test('should show validation error for kasko user if no education keywords are selected', async () => {
  const mocks = [
    mockedEventTopicsKeywordSetResponse,
    mockedCourseTopicsKeywordSetResponse,
    mockedAudienceKeywordSetResponse,
    mockedEducationLevelsKeywordSetResponse,
    mockedEducationModelsKeywordSetResponse,
    mockedKeywordResponse,
    mockedKeywordsResponse,
    mockedLanguagesResponse,
    mockedKaskoUserResponse,
    mockedKaskoOrganizationDecendantsResponse,
  ];

  const user = userEvent.setup();

  renderComponent(
    {
      type: EVENT_TYPE.Course,
      [EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES]: true,
    },
    mocks
  );

  const educationLevelsKeyword = await findElement(
    'educationLevelsKeywordOption'
  );

  const educationModelsKeyword = await findElement(
    'educationModelsKeywordOption'
  );

  await user.click(educationLevelsKeyword);
  await user.click(educationLevelsKeyword);

  await user.tab();

  await user.click(educationModelsKeyword);
  await user.click(educationModelsKeyword);

  await user.tab();

  await screen.findAllByText('Vähintään 1 avainsana tulee olla valittuna');
});
