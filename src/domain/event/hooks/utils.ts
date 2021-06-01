import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import { OptionType } from '../../../types';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { AUDIENCE_ORDER, EVENT_EDIT_ACTIONS } from '../constants';

export const getEventUpdateAction = (
  event: EventFieldsFragment,
  publicationStatus: PublicationStatus
): EVENT_EDIT_ACTIONS => {
  if (event.publicationStatus === PublicationStatus.Draft) {
    return publicationStatus === PublicationStatus.Draft
      ? EVENT_EDIT_ACTIONS.UPDATE_DRAFT
      : EVENT_EDIT_ACTIONS.PUBLISH;
  }
  return EVENT_EDIT_ACTIONS.UPDATE_PUBLIC;
};

const getAudienceIndex = (atId: string) => {
  const index = AUDIENCE_ORDER.indexOf(parseIdFromAtId(atId) as string);
  return index !== -1 ? index : AUDIENCE_ORDER.length;
};

export const sortAudienceOptions = (a: OptionType, b: OptionType): number =>
  getAudienceIndex(a.value) - getAudienceIndex(b.value);
