import { TEST_PUBLISHER_ID } from '../../organization/constants';
import {
  ExpandedOrganizationsActionTypes,
  expandedOrganizationsInitialState,
} from '../constants';
import { expandedOrganizationsReducer } from '../reducers';
import {
  ExpandedOrganizationsAction,
  ExpandedOrganizationsState,
} from '../types';

describe('expandedOrganizationsReducer function', () => {
  const cases: [
    ExpandedOrganizationsAction,
    ExpandedOrganizationsState,
    ExpandedOrganizationsState,
  ][] = [
    [
      {
        type: ExpandedOrganizationsActionTypes.ADD_EXPANDED_ORGANIZATION,
        payload: TEST_PUBLISHER_ID,
      },
      expandedOrganizationsInitialState,
      [TEST_PUBLISHER_ID],
    ],
    [
      {
        type: ExpandedOrganizationsActionTypes.ADD_EXPANDED_ORGANIZATION,
        payload: TEST_PUBLISHER_ID,
      },
      [TEST_PUBLISHER_ID],
      [TEST_PUBLISHER_ID],
    ],
    [
      {
        type: ExpandedOrganizationsActionTypes.REMOVE_EXPANDED_ORGANIZATION,
        payload: TEST_PUBLISHER_ID,
      },
      [TEST_PUBLISHER_ID],
      [],
    ],
    [
      {
        type: ExpandedOrganizationsActionTypes.REMOVE_EXPANDED_ORGANIZATION,
        payload: TEST_PUBLISHER_ID,
      },
      [TEST_PUBLISHER_ID, 'organization:2'],
      ['organization:2'],
    ],
    [
      {
        type: ExpandedOrganizationsActionTypes.REMOVE_EXPANDED_ORGANIZATION,
        payload: TEST_PUBLISHER_ID,
      },
      [TEST_PUBLISHER_ID, 'organization:2', 'organization:2'],
      ['organization:2'],
    ],
  ];

  it.each(cases)(
    'should return correct state with action %p',
    async (action, initialState, state) => {
      expect(expandedOrganizationsReducer(initialState, action)).toEqual(state);
    }
  );
});
