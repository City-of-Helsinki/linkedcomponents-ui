/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { PropsWithChildren } from 'react';
import { unstable_HistoryRouter as Router } from 'react-router-dom';

import { UpdateImageDocument } from '../../../../generated/graphql';
import generateAtId from '../../../../utils/generateAtId';
import { fakeImage } from '../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import { createCache } from '../../../app/apollo/apolloClient';
import {
  getMockedImageResponse,
  imageFields,
  mockedImageNotFoundResponse,
} from '../../../image/__mocks__/image';
import { TEST_IMAGE_ID } from '../../../image/constants';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { EVENT_INITIAL_VALUES } from '../../constants';
import useUpdateImageIfNeeded from '../useUpdateImageIfNeeded';

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const history = createMemoryHistory();
const commonMocks = [mockedUserResponse, mockedOrganizationAncestorsResponse];

const getHookWrapper = (mocks: MockedResponse[] = []) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <MockedProvider cache={createCache()} mocks={[...commonMocks, ...mocks]}>
      <Router
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        history={history as any}
      >
        {children}
      </Router>
    </MockedProvider>
  );
  const { result } = renderHook(() => useUpdateImageIfNeeded(), {
    wrapper,
  });
  return { result };
};

test('should return false if image is is not in values', async () => {
  const { result } = getHookWrapper();

  const isUpdated = await result.current.updateImageIfNeeded({
    ...EVENT_INITIAL_VALUES,
    images: [],
  });

  expect(isUpdated).toBeFalsy();
});

test("should return false if image doesn't exist", async () => {
  const { result } = getHookWrapper([mockedImageNotFoundResponse]);

  let isUpdated = true;
  await act(async () => {
    isUpdated = await result.current.updateImageIfNeeded({
      ...EVENT_INITIAL_VALUES,
      images: [generateAtId('not-found', 'image')],
    });
  });

  expect(isUpdated).toBeFalsy();
});

test('should return true if image is updated', async () => {
  const imageDetails = {
    altText: imageFields.altText,
    license: imageFields.license,
    name: imageFields.name,
    photographerName: imageFields.photographerName,
  };
  const updateImageVariables = { id: imageFields.id, input: imageDetails };
  const updateImageResponse = { data: { updateImage: fakeImage() } };
  const mockedUpdateImageResponse: MockedResponse = {
    request: { query: UpdateImageDocument, variables: updateImageVariables },
    result: updateImageResponse,
  };

  const { result } = getHookWrapper([
    getMockedImageResponse(fakeImage()),
    mockedUpdateImageResponse,
  ]);

  await waitFor(() => expect(result.current.user).not.toBeUndefined());

  let isUpdated = true;
  await act(async () => {
    isUpdated = await result.current.updateImageIfNeeded({
      ...EVENT_INITIAL_VALUES,
      publisher: TEST_PUBLISHER_ID,
      images: [generateAtId(TEST_IMAGE_ID, 'image')],
      imageDetails,
    });
  });

  expect(isUpdated).toBeTruthy();
});
