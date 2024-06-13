import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';

import { mockAuthenticatedLoginState } from '../../../../../../utils/mockLoginHooks';
import {
  actWait,
  configure,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../../../utils/testUtils';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../../constants';
import { EventTime, RecurringEventSettings } from '../../../../types';
import { publicEventSchema } from '../../../../validation';
import {
  TimeSectionContext,
  timeSectionContextDefaultValue,
  TimeSectionProvider,
} from '../../TimeSectionContext';
import RecurringEventTab from '../RecurringEventTab';

configure({ defaultHidden: true });

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

beforeEach(() => {
  vi.setSystemTime('2021-04-12');
  mockAuthenticatedLoginState();
});

const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: EventTime[];
  [EVENT_FIELDS.EVENTS]: EventTime[];
  [EVENT_FIELDS.IS_UMBRELLA]: boolean;
  [EVENT_FIELDS.RECURRING_EVENTS]: RecurringEventSettings[];
  [EVENT_FIELDS.TYPE]: string;
};
const defaultInitialValue: InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.EVENTS]: [],
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.TYPE]: type,
};

const recurringEvents: RecurringEventSettings[] = [
  {
    endDate: new Date('2021-05-15T00:00:00.000Z'),
    endTime: '15.00',
    eventTimes: [
      {
        id: null,
        endTime: new Date('2021-05-03T15:00:00.000Z'),
        startTime: new Date('2021-05-03T12:00:00.000Z'),
      },
      {
        id: null,
        endTime: new Date('2021-05-10T15:00:00.000Z'),
        startTime: new Date('2021-05-10T12:00:00.000Z'),
      },
    ],
    repeatDays: ['mon'],
    repeatInterval: 1,
    startDate: new Date('2021-05-01T00:00:00.000Z'),
    startTime: '12.00',
  },
];

const defaultMocks = [mockedUserResponse];

const renderComponent = ({
  initialValues,
  mocks = defaultMocks,
}: {
  initialValues?: Partial<typeof defaultInitialValue>;
  mocks?: MockedResponse[];
} = {}) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValue, ...initialValues }}
      onSubmit={vi.fn()}
      validationSchema={publicEventSchema}
    >
      <TimeSectionProvider isEditingAllowed>
        <RecurringEventTab />
      </TimeSectionProvider>
    </Formik>,
    { mocks }
  );

const getRecurringEventElement = (
  key:
    | 'addButton'
    | 'endDate'
    | 'endTime'
    | 'monCheckbox'
    | 'repeatInterval'
    | 'startDate'
    | 'startTime'
    | 'tueCheckbox'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', {
        name: /tallenna toistuva tapahtuma/i,
      });
    case 'endDate':
      return screen.getByLabelText(/toisto päättyy/i);
    case 'endTime':
      return within(
        screen.getByRole('group', { name: /tapahtuma päättyy klo/i })
      ).getByLabelText('tunnit');
    case 'monCheckbox':
      return screen.getByLabelText('Ma');
    case 'repeatInterval':
      return screen.getByRole('spinbutton', { name: /tapahtuma toistuu \*/i });
    case 'startDate':
      return screen.getByLabelText(/toisto alkaa/i);
    case 'startTime':
      return within(
        screen.getByRole('group', { name: /tapahtuma alkaa klo/i })
      ).getByLabelText('tunnit');
    case 'tueCheckbox':
      return screen.getByLabelText('Ti');
  }
};

const enterFormValues = async () => {
  const user = userEvent.setup();

  const tueCheckbox = getRecurringEventElement('tueCheckbox');
  const endDateInput = getRecurringEventElement('endDate');
  const endTimeInput = getRecurringEventElement('endTime');
  const startDateInput = getRecurringEventElement('startDate');
  const startTimeInput = getRecurringEventElement('startTime');

  await user.click(tueCheckbox);

  const dateFields = [
    { component: startDateInput, value: '23.4.2021' },
    { component: endDateInput, value: '11.5.2021' },
  ];

  for (const { component, value } of dateFields) {
    fireEvent.change(component, { target: { value } });
  }

  const timeFields = [
    { component: startTimeInput, value: '12:00' },
    { component: endTimeInput, value: '14:00' },
  ];

  for (const { component, value } of timeFields) {
    await user.click(component);
    await user.type(component, value);
  }
};

test('should add/delete recurring event', async () => {
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.RECURRING_EVENTS]: recurringEvents };

  renderComponent({ initialValues });

  const addButton = getRecurringEventElement('addButton');

  await enterFormValues();

  await waitFor(() => expect(addButton).toBeEnabled());
  await user.click(addButton);

  await screen.findByRole('heading', {
    name: 'Ti, Viikon välein, 23.4.2021 – 11.5.2021',
  });
  screen.getByRole('heading', {
    name: 'Ma, Viikon välein, 1.5.2021 – 15.5.2021',
  });

  const deleteButton = screen.getAllByRole('button', { name: /poista/i })[0];
  await user.click(deleteButton);

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', {
        name: 'Ti, Viikon välein, 23.4.2021 – 11.5.2021',
      })
    ).not.toBeInTheDocument()
  );
  screen.getByRole('heading', {
    name: 'Ma, Viikon välein, 1.5.2021 – 15.5.2021',
  });
});

test('should show validation error when repeat interval in invalid', async () => {
  const user = userEvent.setup();

  renderComponent();

  const repeatIntervalInput = getRecurringEventElement('repeatInterval');
  const startDateInput = getRecurringEventElement('startDate');

  await user.clear(repeatIntervalInput);
  await user.type(repeatIntervalInput, '0');

  await user.click(startDateInput);
  await screen.findByText('Arvon tulee olla vähintään 1');

  await user.clear(repeatIntervalInput);
  await user.type(repeatIntervalInput, '5');

  await screen.findByText('Arvon tulee olla enintään 4');
});

test('should show validation error when end date is before start date', async () => {
  const user = userEvent.setup();

  renderComponent();

  const endDateInput = getRecurringEventElement('endDate');
  const startDateInput = getRecurringEventElement('startDate');

  const dateFields = [
    { component: startDateInput, value: '11.5.2021' },
    { component: endDateInput, value: '23.4.2021' },
  ];

  for (const { component, value } of dateFields) {
    await user.click(component);
    await user.type(component, value);
  }

  await user.click(startDateInput);
  await screen.findByText('Tämän päivämäärän tulee olla 11.5.2021 jälkeen');
});

test('should show validation error when end time is before start time in recurring event form', async () => {
  const user = userEvent.setup();

  renderComponent();

  const endTimeInput = getRecurringEventElement('endTime');
  const startTimeInput = getRecurringEventElement('startTime');

  const timeFields = [
    { component: startTimeInput, value: '14.00' },
    { component: endTimeInput, value: '12.00' },
  ];

  for (const { component, value } of timeFields) {
    await user.click(component);
    await user.type(component, value);
  }

  await user.click(startTimeInput);
  await screen.findByText('Tämän kellonajan tulee olla 14.00 jälkeen');
});

test('should set isUmbrella to false when adding more than 1 event time', async () => {
  const user = userEvent.setup();
  const setIsUmbrella = vi.fn();

  render(
    <Formik
      initialValues={{ ...defaultInitialValue, isUmbrella: true }}
      onSubmit={vi.fn()}
    >
      <TimeSectionContext.Provider
        value={{
          ...timeSectionContextDefaultValue,
          isUmbrella: true,
          setIsUmbrella,
        }}
      >
        <RecurringEventTab />
      </TimeSectionContext.Provider>
    </Formik>,
    { mocks: defaultMocks }
  );

  await enterFormValues();

  const addButton = getRecurringEventElement('addButton');
  await waitFor(() => expect(addButton).toBeEnabled());
  await user.click(addButton);

  expect(setIsUmbrella).toBeCalledWith(false);
});

test('should not show instructions for admin user', async () => {
  renderComponent();
  // Wait user data to be loaded
  await actWait(100);

  expect(
    screen.queryByRole('region', { name: 'Tapahtuman ajankohdat' })
  ).not.toBeInTheDocument();
});

test('should show instructions for external user', async () => {
  const mocks = [mockedUserWithoutOrganizationsResponse];
  // Wait user data to be loaded
  await actWait(100);

  renderComponent({ mocks });

  expect(
    screen.getByRole('region', { name: 'Tapahtuman ajankohdat' })
  ).toBeInTheDocument();
});
