import { Formik } from 'formik';
import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { mockedAudienceKeywordSetResponse } from '../../../../keywordSet/__mocks__/keywordSets';
import { mockedLanguagesResponse } from '../../../../language/__mocks__/language';
import { INTERNET_PLACE_ID } from '../../../../place/constants';
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

const type = EVENT_TYPE.General;

const mocks = [
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedEventTopicsKeywordSetResponse,
  mockedCourseTopicsKeywordSetResponse,
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
      <ClassificationSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );

const findElement = (key: 'keywordText' | 'keywordOption') => {
  switch (key) {
    case 'keywordText':
      return screen.findByText(
        keyword?.name?.fi as string,
        { selector: 'span' },
        { timeout: 2000 }
      );
    case 'keywordOption':
      return screen.findByRole('option', { name: keyword?.name?.fi as string });
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
  await act(async () => {
    await renderComponent({
      [EVENT_FIELDS.KEYWORDS]: [keyword?.atId as string],
    });
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

test('should show 10 first topics by default and rest by clicking show more', async () => {
  const sortedKeywords = [...eventTopicNames, removeParticipationName].sort();
  const defaultKeywords = sortedKeywords.slice(0, 10);
  const restKeywords = [...sortedKeywords].slice(10);

  const user = userEvent.setup();
  renderComponent();

  await screen.findByLabelText(eventTopicNames[0]);

  for (const name of defaultKeywords.slice(1)) {
    screen.getByLabelText(name);
  }
  for (const name of restKeywords) {
    expect(screen.queryByLabelText(name)).not.toBeInTheDocument();
  }

  await act(async () => await user.click(getElement('showMoreButton')));

  await screen.findByLabelText(restKeywords[0]);
  for (const name of restKeywords.slice(1)) {
    screen.getByLabelText(name);
  }
});

test('should show course topics', async () => {
  await act(async () => {
    await renderComponent({ type: EVENT_TYPE.Course });
  });

  await screen.findByLabelText(courseTopicNames[0]);

  for (const name of courseTopicNames.slice(1)) {
    screen.getByLabelText(name);
  }
});

test('should change keyword', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getElement('toggleButton');
  await act(async () => await user.click(toggleButton));

  const keywordOption = await findElement('keywordOption');
  await act(async () => await user.click(keywordOption));

  expect(
    screen.queryByRole('listbox', { name: /avainsanahaku/i })
  ).not.toBeInTheDocument();
  await findElement('keywordText');
});

test('should show correct validation error if none main category is selected', async () => {
  const user = userEvent.setup();
  renderComponent();

  const mainCategoryCheckbox = await screen.findByRole('checkbox', {
    name: eventTopicNames[0],
  });
  await act(async () => await user.click(mainCategoryCheckbox));
  await act(async () => await user.click(mainCategoryCheckbox));

  const toggleButton = getElement('toggleButton');
  await act(async () => await user.click(toggleButton));
  await act(async () => await user.tab());

  await screen.findByText('Vähintään 1 pääluokka tulee olla valittuna');
});

test('should select remote participation if internet is selected as a location', async () => {
  await act(async () => {
    await renderComponent({ [EVENT_FIELDS.LOCATION]: INTERNET_PLACE_ID });
  });

  const remoteParticipationCheckbox = await screen.findByRole('checkbox', {
    name: removeParticipationName,
  });

  await waitFor(() => expect(remoteParticipationCheckbox).toBeChecked());
  expect(remoteParticipationCheckbox).toBeDisabled();
});

test('should show correct validation error if none keyword is selected', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getElement('toggleButton');
  await act(async () => await user.click(toggleButton));
  await act(async () => await user.tab());

  await screen.findByText('Vähintään 1 avainsana tulee olla valittuna');
});
