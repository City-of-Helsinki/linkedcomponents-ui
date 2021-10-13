import { PlaceDocument } from '../../../generated/graphql';
import { fakePlace } from '../../../utils/mockDataUtils';
import { TEST_PLACE_ID } from '../constants';

const placeOverrides = {
  id: TEST_PLACE_ID,
};

const place = fakePlace({ ...placeOverrides });
const placeResponse = { data: { place } };
const placeVariables = { id: TEST_PLACE_ID, createPath: undefined };
const mockedPlaceResponse = {
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
};

export { mockedPlaceResponse, place, placeOverrides };
