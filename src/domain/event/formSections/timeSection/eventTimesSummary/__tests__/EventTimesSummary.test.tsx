import { mockUnauthenticatedLoginState } from '../../../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../../utils/testUtils';
import { EventTime, RecurringEventSettings } from '../../../../types';
import {
  TimeSectionContext,
  timeSectionContextDefaultValue,
  TimeSectionContextProps,
} from '../../TimeSectionContext';
import EventTimesSummary from '../EventTimesSummary';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  vi.useRealTimers();
  mockUnauthenticatedLoginState();
});

const renderComponent = (context?: Partial<TimeSectionContextProps>) =>
  render(
    <TimeSectionContext.Provider
      value={{ ...timeSectionContextDefaultValue, ...context }}
    >
      <EventTimesSummary />
    </TimeSectionContext.Provider>
  );

test('should render event times summary', async () => {
  vi.setSystemTime('2021-04-12');
  const eventTimes: EventTime[] = [
    {
      endTime: new Date('2021-05-02T15:00:00.000Z'),
      id: null,
      startTime: new Date('2021-05-02T12:00:00.000Z'),
    },
    {
      endTime: new Date('2021-05-03T15:00:00.000Z'),
      id: null,
      startTime: new Date('2021-05-03T12:00:00.000Z'),
    },
  ];

  const recurringEvents: RecurringEventSettings[] = [
    {
      endDate: new Date('2021-05-07'),
      endTime: '12.00',
      eventTimes: [
        {
          endTime: new Date('2021-05-07T15:00:00.000Z'),
          id: null,
          startTime: new Date('2021-05-07T12:00:00.000Z'),
        },
        {
          endTime: new Date('2021-05-09T15:00:00.000Z'),
          id: null,
          startTime: new Date('2021-05-09T12:00:00.000Z'),
        },
      ],
      repeatDays: ['mon', 'wed'],
      repeatInterval: 1,
      startDate: new Date('2021-05-07'),
      startTime: '12.00',
    },
  ];

  const user = userEvent.setup();
  renderComponent({ eventTimes, recurringEvents });

  const toggleButton = screen.getByRole('button', {
    name: 'Ma ja Ke, Viikon välein, 7.5.2021 – 7.5.2021',
  });
  await user.click(toggleButton);

  screen.getByRole('row', { name: '7.5.2021 12.00 – 7.5.2021 15.00' });
  screen.getByRole('row', { name: '9.5.2021 12.00 – 9.5.2021 15.00' });

  screen.getByRole('row', { name: '2.5.2021 12.00 – 2.5.2021 15.00' });
  screen.getByRole('row', { name: '3.5.2021 12.00 – 3.5.2021 15.00' });
});
