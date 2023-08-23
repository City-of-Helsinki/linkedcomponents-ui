import { PublicationStatus } from '../../../../generated/graphql';
import { fakeEvent } from '../../../../utils/mockDataUtils';
import { EVENT_ACTIONS } from '../../constants';
import { getEventUpdateAction, sortAudienceOptions } from '../utils';

describe('getEventUpdateAction function', () => {
  const testCases: [PublicationStatus, PublicationStatus, EVENT_ACTIONS][] = [
    [
      PublicationStatus.Draft,
      PublicationStatus.Draft,
      EVENT_ACTIONS.UPDATE_DRAFT,
    ],
    [
      PublicationStatus.Draft,
      PublicationStatus.Public,
      EVENT_ACTIONS.ACCEPT_AND_PUBLISH,
    ],
    [
      PublicationStatus.Public,
      PublicationStatus.Draft,
      EVENT_ACTIONS.UPDATE_PUBLIC,
    ],
    [
      PublicationStatus.Public,
      PublicationStatus.Public,
      EVENT_ACTIONS.UPDATE_PUBLIC,
    ],
  ];

  it.each(testCases)(
    'should return correct action with event publication status %p and new publication status %p, returns %p',
    (eventPublicationStatus, publicationStatus, expectedAction) =>
      expect(
        getEventUpdateAction(
          fakeEvent({ publicationStatus: eventPublicationStatus }),
          publicationStatus
        )
      ).toBe(expectedAction)
  );
});

describe('sortAudienceOptions function', () => {
  it('should sort audience options', () =>
    expect(
      [
        { value: 'helsinki:aflfbat76e', label: 'Palvelukeskuskortti' },
        { value: 'yso:p11617', label: 'Nuoret' },
        { value: 'yso:p13050', label: 'Lapsiperheet' },
        { value: 'yso:p6165', label: 'Maahanmuuttajat' },
        { value: 'yso:p7179', label: 'Vammaiset' },
        { value: 'yso:p16486', label: 'Opiskelijat' },
        { value: 'yso:p2433', label: 'Ikääntyneet' },
        { value: 'yso:p12297', label: 'Mielenterveyskuntoutujat' },
        { value: 'helsinki:aflfbatkwe', label: 'Omaishoitoperheet' },
        { value: 'yso:p3128', label: 'Yritykset' },
        { value: 'yso:p5590', label: 'Aikuiset' },
        { value: 'yso:p16485', label: 'Koululaiset' },
        { value: 'yso:p20513', label: 'Vauvaperheet' },
        { value: 'yso:p1393', label: 'Järjestöt' },
        { value: 'yso:p4354', label: 'Lapset' },
      ].sort(sortAudienceOptions('fi'))
    ).toEqual([
      { value: 'yso:p5590', label: 'Aikuiset' },
      { value: 'yso:p2433', label: 'Ikääntyneet' },
      { value: 'yso:p1393', label: 'Järjestöt' },
      { value: 'yso:p16485', label: 'Koululaiset' },
      { value: 'yso:p4354', label: 'Lapset' },
      { value: 'yso:p13050', label: 'Lapsiperheet' },
      { value: 'yso:p6165', label: 'Maahanmuuttajat' },
      { value: 'yso:p12297', label: 'Mielenterveyskuntoutujat' },
      { value: 'yso:p11617', label: 'Nuoret' },
      { value: 'helsinki:aflfbatkwe', label: 'Omaishoitoperheet' },
      { value: 'yso:p16486', label: 'Opiskelijat' },
      { value: 'helsinki:aflfbat76e', label: 'Palvelukeskuskortti' },
      { value: 'yso:p7179', label: 'Vammaiset' },
      { value: 'yso:p20513', label: 'Vauvaperheet' },
      { value: 'yso:p3128', label: 'Yritykset' },
    ]));
});
