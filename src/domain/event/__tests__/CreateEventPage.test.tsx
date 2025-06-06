/* eslint-disable max-len */
/* eslint-disable no-console */

import { MockedResponse } from '@apollo/client/testing';
import { FormikState } from 'formik';

import { mockedKeywordsResponse as mockedKeywordSelectorKeywordsResponse } from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  FORM_NAMES,
  LE_DATA_LANGUAGES,
} from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  imageFields,
  mockedImageResponse,
  mockedImagesResponse,
  mockedUpdateImageResponse,
} from '../../image/__mocks__/image';
import {
  mockedAudienceKeywordSetResponse,
  mockedEducationLevelsKeywordSetResponse,
  mockedEducationModelsKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  topicAtIds,
} from '../../keywordSet/__mocks__/keywordSets';
import { mockedLanguagesResponse } from '../../language/__mocks__/language';
import {
  mockedOrganizationResponse,
  organizationId,
} from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import {
  mockedFilteredPlacesResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  placeAtId,
} from '../../place/__mocks__/place';
import {
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
} from '../../priceGroup/__mocks__/priceGroups';
import {
  mockedSuperuserResponse,
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../user/__mocks__/user';
import {
  eventValues,
  keywordAtId,
  keywordName,
  mockedCreateDraftEventResponse,
  mockedCreatePublicEventResponse,
  mockedCreateSubEventsResponse,
  mockedInvalidCreateDraftEventResponse,
  mockedUmbrellaEventsResponse,
} from '../__mocks__/createEventPage';
import { EVENT_EXTERNAL_USER_INITIAL_VALUES, EVENT_FIELDS } from '../constants';
import CreateEventPage from '../CreateEventPage';
import { EventFormFields } from '../types';
import {
  testExternalUserFields,
  testInstructionNotifications,
} from './eventTestUtils';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
  // restoring date after each test run
  vi.useRealTimers();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const commonMocks = [
  mockedImagesResponse,
  mockedImageResponse,
  mockedUmbrellaEventsResponse,
  mockedAudienceKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  mockedEducationLevelsKeywordSetResponse,
  mockedEducationModelsKeywordSetResponse,
  mockedKeywordSelectorKeywordsResponse,
  mockedLanguagesResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  // PlaceSelector component requires second mock. https://github.com/apollographql/react-apollo/issues/617
  mockedFilteredPlacesResponse,
  mockedFilteredPlacesResponse,
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
];

const defaultMocks = [...commonMocks, mockedUserResponse];

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateEventPage />, {
    mocks,
  });

const setFormValues = (values: Partial<EventFormFields>) => {
  const state: FormikState<EventFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...EVENT_EXTERNAL_USER_INITIAL_VALUES,
      [EVENT_FIELDS.PUBLISHER]: organizationId,
      [EVENT_FIELDS.MAIN_CATEGORIES]: topicAtIds,
      ...values,
    },
  };

  sessionStorage.setItem(FORM_NAMES.EVENT_FORM, JSON.stringify(state));
};

const getElement = (
  key: 'mainCategories' | 'publish' | 'saveDraft' | 'superEvent'
) => {
  switch (key) {
    case 'mainCategories':
      return screen.getByRole('group', { name: /valitse kategoria\(t\)/i });
    case 'publish':
      return screen.getByRole('button', {
        name: 'Julkaise tapahtuma',
      });
    case 'saveDraft':
      return screen.getByRole('button', {
        name: 'Tallenna luonnos',
      });
    case 'superEvent':
      return screen.getByRole('combobox', {
        name: /Kattotapahtuma/,
      });
  }
};

const findElement = (
  key:
    | 'description'
    | 'name'
    | 'nameSv'
    | 'saveDraft'
    | 'sendToModerator'
    | 'superEvent'
) => {
  switch (key) {
    case 'description':
      return screen.findByLabelText(
        /tekstimuotoilueditori. muokkausalue: main/i
      );
    case 'name':
      return screen.findByLabelText(/tapahtuman otsikko suomeksi/i);
    case 'nameSv':
      return screen.findByLabelText(/tapahtuman otsikko ruotsiksi/i);
    case 'saveDraft':
      return screen.findByRole('button', { name: 'Tallenna luonnos' });
    case 'sendToModerator':
      return screen.findByRole('button', {
        name: 'Tallenna ja lähetä moderoijalle',
      });
    case 'superEvent':
      return screen.findByRole(
        'combobox',
        { name: /Kattotapahtuma/ },
        { timeout: 10000 }
      );
  }
};

const waitLoadingAndFindNameInput = async () => {
  await loadingSpinnerIsNotInDocument();
  return await findElement('name');
};

test('should focus to first validation error when trying to save draft event', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameTextbox = await waitLoadingAndFindNameInput();
  const saveDraftButton = getElement('saveDraft');

  await user.click(saveDraftButton);

  await waitFor(() => expect(nameTextbox).toHaveFocus());
});

test('should focus to first validation error when trying to save draft event as external user', async () => {
  const user = userEvent.setup();

  const mocks = [...commonMocks, mockedUserWithoutOrganizationsResponse];

  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const sendToModeratorButton = await findElement('sendToModerator');
  const providerField = await screen.findByLabelText(
    /tapahtuman järjestäjä suomeksi/i
  );

  await user.click(sendToModeratorButton);

  await waitFor(() => expect(providerField).toHaveFocus());
});

test('should focus to validation error of swedish name when trying to save draft event', async () => {
  setFormValues({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
      LE_DATA_LANGUAGES.FI,
      LE_DATA_LANGUAGES.SV,
    ],
    [EVENT_FIELDS.NAME]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
  });
  const user = userEvent.setup();

  renderComponent();

  await waitLoadingAndFindNameInput();

  const saveDraftButton = getElement('saveDraft');
  await user.click(saveDraftButton);

  const nameSvTextbox = await findElement('nameSv');
  await waitFor(() => expect(nameSvTextbox).toHaveFocus());
});

test('should focus to select component in case of validation error', async () => {
  setFormValues({ [EVENT_FIELDS.HAS_UMBRELLA]: true });
  const user = userEvent.setup();

  renderComponent();

  await waitLoadingAndFindNameInput();

  const superEventSelect = await findElement('superEvent');

  const publishButton = getElement('publish');
  await user.click(publishButton);

  await waitFor(() => expect(superEventSelect).toHaveFocus());
});

test('should focus to text editor component in case of validation error', async () => {
  setFormValues({
    [EVENT_FIELDS.NAME]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
    [EVENT_FIELDS.SHORT_DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.shortDescription,
    },
  });
  const user = userEvent.setup();

  renderComponent();

  await waitLoadingAndFindNameInput();

  const descriptionTextbox = await findElement('description');

  const publishButton = getElement('publish');
  await user.click(publishButton);

  await waitFor(() => expect(descriptionTextbox).toHaveFocus());
});

test('should focus to event times error if none event time exists', async () => {
  setFormValues({
    [EVENT_FIELDS.DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.description,
    },
    [EVENT_FIELDS.EVENT_TIMES]: [],
    [EVENT_FIELDS.NAME]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
    [EVENT_FIELDS.SHORT_DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.shortDescription,
    },
  });
  const user = userEvent.setup();

  renderComponent();

  await waitLoadingAndFindNameInput();

  const publishButton = getElement('publish');
  await user.click(publishButton);

  const error = await screen.findByText(/vähintään 1 ajankohta vaaditaan/i);
  await waitFor(() => expect(error).toHaveFocus());
});

test('should focus to first main category checkbox if none main category is selected', async () => {
  vi.setSystemTime('2020-12-20');

  setFormValues({
    [EVENT_FIELDS.DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.description,
    },
    [EVENT_FIELDS.EVENT_TIMES]: [eventValues.eventTimes[0]],
    [EVENT_FIELDS.IMAGES]: [imageFields.atId],
    [EVENT_FIELDS.IMAGE_DETAILS]: imageFields,
    [EVENT_FIELDS.IS_VERIFIED]: true,
    [EVENT_FIELDS.KEYWORDS]: [],
    [EVENT_FIELDS.LOCATION]: placeAtId,
    [EVENT_FIELDS.NAME]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
    [EVENT_FIELDS.SHORT_DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.shortDescription,
    },
  });

  const mocks: MockedResponse[] = [
    ...defaultMocks,
    mockedCreateSubEventsResponse,
    mockedCreatePublicEventResponse,
    mockedUpdateImageResponse,
  ];
  const user = userEvent.setup();

  renderComponent(mocks);

  await waitLoadingAndFindNameInput();

  const withinMainCategories = within(getElement('mainCategories'));
  const keywordCheckbox =
    await withinMainCategories.findByLabelText(keywordName);

  const publishButton = getElement('publish');
  await user.click(publishButton);

  await waitFor(() => expect(keywordCheckbox).toHaveFocus());
});

test('should show server errors', async () => {
  setFormValues({
    [EVENT_FIELDS.EVENT_TIMES]: [eventValues.eventTimes[0]],
    [EVENT_FIELDS.IS_VERIFIED]: true,
    [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: 50,
    [EVENT_FIELDS.NAME]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
  });
  const mocks = [...defaultMocks, mockedInvalidCreateDraftEventResponse];
  const user = userEvent.setup();

  renderComponent(mocks);

  await waitLoadingAndFindNameInput();

  const saveDraftButton = getElement('saveDraft');
  await user.click(saveDraftButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i, undefined, {
    timeout: 5000,
  });
  screen.getByText(/lopetusaika ei voi olla menneisyydessä./i);
});

test('should route to event completed page after saving draft event', async () => {
  setFormValues({
    [EVENT_FIELDS.EVENT_TIMES]: [eventValues.eventTimes[0]],
    [EVENT_FIELDS.IS_VERIFIED]: true,
    [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: 50,
    [EVENT_FIELDS.NAME]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
  });
  const mocks = [...defaultMocks, mockedCreateDraftEventResponse];
  const user = userEvent.setup();

  const { history } = renderComponent(mocks);

  await waitLoadingAndFindNameInput();

  const saveDraftButton = getElement('saveDraft');
  await user.click(saveDraftButton);

  await waitFor(
    () =>
      expect(history.location.pathname).toBe(
        `/fi/events/completed/${eventValues.id}`
      ),
    { timeout: 20000 }
  );
});

test('should route to event completed page after publishing event', async () => {
  vi.setSystemTime('2020-12-20');

  setFormValues({
    [EVENT_FIELDS.DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.description,
    },
    [EVENT_FIELDS.EVENT_TIMES]: eventValues.eventTimes,
    [EVENT_FIELDS.IMAGES]: [imageFields.atId],
    [EVENT_FIELDS.IMAGE_DETAILS]: imageFields,
    [EVENT_FIELDS.IS_VERIFIED]: true,
    [EVENT_FIELDS.KEYWORDS]: [keywordAtId],
    [EVENT_FIELDS.LOCATION]: placeAtId,
    [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: 50,
    [EVENT_FIELDS.NAME]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
    [EVENT_FIELDS.SHORT_DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.shortDescription,
    },
  });

  const mocks: MockedResponse[] = [
    ...defaultMocks,
    mockedCreateSubEventsResponse,
    mockedCreatePublicEventResponse,
    mockedUpdateImageResponse,
  ];
  const user = userEvent.setup();

  const { history } = renderComponent(mocks);

  await waitLoadingAndFindNameInput();

  const publishButton = getElement('publish');
  await user.click(publishButton);

  await waitFor(
    () =>
      expect(history.location.pathname).toBe(
        `/fi/events/completed/${eventValues.id}`
      ),
    { timeout: 20000 }
  );
});

test('should render fields for external user', async () => {
  const mocks = [...commonMocks, mockedUserWithoutOrganizationsResponse];

  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  await testExternalUserFields();
});

test('should render instruction notifications for external user', async () => {
  const mocks = [...commonMocks, mockedUserWithoutOrganizationsResponse];

  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  await testInstructionNotifications(true);
});

test('should not render instruction notifications for admin user', async () => {
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  await testInstructionNotifications(false);
});

test('should not render instruction notifications for superuser', async () => {
  const mocks = [...commonMocks, mockedSuperuserResponse];
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  await testInstructionNotifications(false);
});
