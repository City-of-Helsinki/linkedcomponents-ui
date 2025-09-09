/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import omit from 'lodash/omit';
import { PropsWithChildren } from 'react';
import { unstable_HistoryRouter as Router } from 'react-router';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../../constants';
import {
  Event,
  EventDocument,
  EventFieldsFragment,
  OrganizationsDocument,
  SuperEventType,
  UpdateEventDocument,
} from '../../../../generated/graphql';
import { fakeEvent, fakeOrganizations } from '../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import skipFalsyType from '../../../../utils/skipFalsyType';
import { createCache } from '../../../app/apollo/apolloClient';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  MAX_OGRANIZATIONS_PAGE_SIZE,
  TEST_PUBLISHER_ID,
} from '../../../organization/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { EVENT_INCLUDES } from '../../constants';
import useUpdateRecurringEventIfNeeded, {
  shouldUpdateTime,
} from '../useUpdateRecurringEventIfNeeded';

beforeEach(() => {
  mockAuthenticatedLoginState();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

const commonMocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const publisher = TEST_PUBLISHER_ID;
const description = {
  ar: '<p>Description</p>',
  en: '<p>Description</p>',
  fi: '<p>Description</p>',
  ru: '<p>Description</p>',
  sv: '<p>Description</p>',
  zhHans: '<p>Description</p>',
};

const superEventId = 'super-event:1';
const subEventId1 = 'sub-event:1';
const subEventId2 = 'sub-event:2';
const superEventVariables = {
  id: 'super-event:1',
  include: EVENT_INCLUDES,
  createPath: undefined,
};

const basePayload = {
  publicationStatus: 'public',
  audience: [],
  audienceMaxAge: null,
  audienceMinAge: null,
  enrolmentEndTime: null,
  enrolmentStartTime: null,
  environment: 'in',
  environmentalCertificate: '',
  externalLinks: [],
  images: [],
  inLanguage: [],
  keywords: [],
  maximumAttendeeCapacity: null,
  minimumAttendeeCapacity: null,
  offers: [{ infoUrl: EMPTY_MULTI_LANGUAGE_OBJECT, isFree: true }],
  publisher,
  superEvent: null,
  superEventType: 'recurring',
  typeId: 'General',
  videos: [],
  userConsent: false,
  userEmail: '',
  userName: '',
  userOrganization: '',
  userPhoneNumber: '',
  id: superEventId,
};

const getMockedSuperEventResponse = (
  superEvent: EventFieldsFragment
): MockedResponse => {
  const superEventResponse = { data: { event: superEvent } };
  return {
    request: { query: EventDocument, variables: superEventVariables },
    result: superEventResponse,
  };
};

const getMockedUpdateSuperEventResponse = ({
  endTime,
  startTime,
  superEvent,
}: {
  endTime: string;
  startTime: string;
  superEvent: EventFieldsFragment;
}): MockedResponse => {
  const updateEventVariables = {
    id: superEventId,
    input: {
      ...basePayload,
      description: omit(superEvent.description, '__typename'),
      infoUrl: omit(superEvent.infoUrl, '__typename'),
      location: { atId: superEvent.location?.atId },
      locationExtraInfo: omit(superEvent.locationExtraInfo, '__typename'),
      name: omit(superEvent.name, '__typename'),
      provider: omit(superEvent.provider, '__typename'),
      shortDescription: omit(superEvent.shortDescription, '__typename'),
      endTime,
      startTime,
      subEvents: superEvent.subEvents
        .filter(skipFalsyType)
        .map(({ atId }) => ({ atId })),
    },
  };

  const updatedSuperEvent = { ...superEvent, endTime, startTime };
  const updateEventResponse = { data: { updateEvent: updatedSuperEvent } };
  return {
    request: { query: UpdateEventDocument, variables: updateEventVariables },
    result: updateEventResponse,
  };
};

const getHookWrapper = (mocks: MockedResponse[] = commonMocks) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <Router history={createMemoryHistory() as any}>
      <MockedProvider cache={createCache()} mocks={mocks}>
        {children}
      </MockedProvider>
    </Router>
  );
  const { result } = renderHook(() => useUpdateRecurringEventIfNeeded(), {
    wrapper,
  });

  // Test the initial state of the request
  expect(result.current.updateRecurringEventIfNeeded).toBeDefined();
  return { result };
};

describe('shouldUpdateTime', () => {
  it.each<[Date | null, Date | null, boolean]>([
    [null, null, false],
    [new Date('2024-01-01'), null, true],
    [null, new Date('2024-01-01'), true],
    [new Date('2024-01-01'), new Date('2024-01-01'), false],
  ])('shouldUpdateTime(%o, %o) -> %s', (oldTime, newTime, shouldUpdate) => {
    expect(shouldUpdateTime(oldTime, newTime)).toEqual(shouldUpdate);
  });
});

test("should return null if event doesn't have super event ", async () => {
  const { result } = getHookWrapper();

  const event = fakeEvent();

  const response = await result.current.updateRecurringEventIfNeeded(event);
  expect(response).toBeNull();
});

test('should return null if super event type of super event is not recurring ', async () => {
  const superEvent = fakeEvent({
    id: superEventId,
    superEventType: SuperEventType.Umbrella,
  });

  const { result } = getHookWrapper([
    ...commonMocks,
    getMockedSuperEventResponse(superEvent),
  ]);

  const event = fakeEvent({ superEvent });
  await act(async () => {
    const response = await result.current.updateRecurringEventIfNeeded(event);
    expect(response).toBeNull();
  });
});

test('should return null if event is not editable', async () => {
  const publisher = 'publisher:2';
  const organizationAncestorsVariables = {
    child: publisher,
    createPath: undefined,
    pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
    dissolved: false,
  };

  const organizationAncestorsResponse = {
    data: { organizations: fakeOrganizations(0) },
  };

  const mockedOrganizationAncestorsResponse = {
    request: {
      query: OrganizationsDocument,
      variables: organizationAncestorsVariables,
    },
    result: organizationAncestorsResponse,
  };

  const superEvent = fakeEvent({
    id: superEventId,
    publisher,
    superEventType: SuperEventType.Recurring,
  });

  const { result } = getHookWrapper([
    ...commonMocks,
    mockedOrganizationAncestorsResponse,
    getMockedSuperEventResponse(superEvent),
  ]);

  const event = fakeEvent({ superEvent });

  await act(async () => {
    const response = await result.current.updateRecurringEventIfNeeded(event);
    expect(response).toBeNull();
  });
});

const testCases: [Event[], { startTime: string; endTime: string } | null][] = [
  // should return null if recurring event start/end time is not changed
  [
    [
      fakeEvent({
        endTime: '2021-12-31T21:00:00.000Z',
        startTime: '2020-12-31T18:00:00.000Z',
      }),
    ],
    null,
  ],
  // should return null if new end date would be in past
  [
    [
      fakeEvent({
        endTime: '2021-04-05T21:00:00.000Z',
        startTime: '2020-12-31T18:00:00.000Z',
      }),
    ],
    null,
  ],
  // should update only start time if new end time would be in past but start time is changed
  [
    [
      fakeEvent({
        id: subEventId1,
        endTime: '2020-12-30T21:00:00.000Z',
        startTime: '2020-12-30T18:00:00.000Z',
      }),
      fakeEvent({
        id: subEventId2,
        endTime: '2021-01-15T21:00:00.000Z',
        startTime: '2021-01-15T18:00:00.000Z',
      }),
    ],
    {
      endTime: '2021-12-31T21:00:00.000Z',
      startTime: '2020-12-30T18:00:00.000Z',
    },
  ],
  // should update both start time and end time
  [
    [
      fakeEvent({
        id: subEventId1,
        endTime: '2021-12-30T21:00:00.000Z',
        startTime: '2021-12-30T18:00:00.000Z',
      }),
      fakeEvent({
        id: subEventId2,
        endTime: '2021-12-31T22:00:00.000Z',
        startTime: '2021-12-31T18:00:00.000Z',
      }),
    ],
    {
      endTime: '2021-12-31T22:00:00.000Z',
      startTime: '2021-12-30T18:00:00.000Z',
    },
  ],
];

test.each(testCases)(
  'should update recurring event if start or end time is changed',
  async (subEvents, newSuperEventTimes) => {
    vi.setSystemTime('2021-05-05');
    const superEvent = fakeEvent({
      id: superEventId,
      publisher,
      description,
      endTime: '2021-12-31T21:00:00.000Z',
      startTime: '2020-12-31T18:00:00.000Z',
      subEvents,
      superEventType: SuperEventType.Recurring,
    });

    const mocks = [...commonMocks, getMockedSuperEventResponse(superEvent)];
    const updatedSuperEvent = { ...superEvent, ...newSuperEventTimes };
    if (newSuperEventTimes) {
      mocks.push(
        getMockedUpdateSuperEventResponse({ ...newSuperEventTimes, superEvent })
      );
    }

    const { result } = getHookWrapper(mocks);

    const event = fakeEvent({ superEvent });

    await waitFor(() => expect(result.current.user).toBeDefined());
    await act(async () => {
      const response = await result.current.updateRecurringEventIfNeeded(event);
      if (newSuperEventTimes) {
        expect(response).toEqual(updatedSuperEvent);
      } else {
        expect(response).toBeNull();
      }
    });
  }
);
