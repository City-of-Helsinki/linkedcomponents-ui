import {
  EventStatus,
  KeywordFieldsFragment,
  PublicationStatus,
  SuperEventType,
} from '../../generated/graphql';
import { MultiLanguageObject } from '../../types';
import { IMAGE_FIELDS } from '../image/constants';
import {
  ADD_EVENT_TIME_FORM_NAME,
  EDIT_EVENT_TIME_FORM_NAME,
  EVENT_FIELDS,
  EVENT_TIME_FIELDS,
  EXTERNAL_LINK_FIELDS,
  RECURRING_EVENT_FIELDS,
  VIDEO_DETAILS_FIELDS,
} from './constants';

export type EventFields = {
  id: string;
  atId: string;
  audienceMaxAge: number | null;
  audienceMinAge: number | null;
  createdBy: string;
  deleted: string | null;
  description: string;
  endTime: Date | null;
  eventStatus: EventStatus;
  eventUrl: string;
  freeEvent: boolean;
  imageUrl: string | null;
  inLanguage: string[];
  isDraft: boolean;
  isPublic: boolean;
  keywords: KeywordFieldsFragment[];
  lastModifiedTime: Date | null;
  name: string;
  offers: Offer[];
  publicationStatus: PublicationStatus;
  publisher: string | null;
  startTime: Date | null;
  subEventAtIds: string[];
  superEventAtId: string | null;
  superEventType: SuperEventType | null;
};

export type EventFormFields = {
  [EVENT_FIELDS.AUDIENCE]: string[];
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: number | '';
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: number | '';
  [EVENT_FIELDS.DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.EVENTS]: EventTime[];
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: string[];
  [EVENT_FIELDS.EVENT_TIMES]: EventTime[];
  [EVENT_FIELDS.ENROLMENT_END_TIME_DATE]: Date | null;
  [EVENT_FIELDS.ENROLMENT_END_TIME_TIME]: string;
  [EVENT_FIELDS.ENROLMENT_START_TIME_DATE]: Date | null;
  [EVENT_FIELDS.ENROLMENT_START_TIME_TIME]: string;
  [EVENT_FIELDS.EXTERNAL_LINKS]: ExternalLink[];
  [EVENT_FIELDS.HAS_PRICE]: boolean;
  [EVENT_FIELDS.HAS_UMBRELLA]: boolean;
  [EVENT_FIELDS.IMAGES]: string[];
  [EVENT_FIELDS.IMAGE_DETAILS]: ImageDetails;
  [EVENT_FIELDS.IN_LANGUAGE]: string[];
  [EVENT_FIELDS.INFO_URL]: MultiLanguageObject;
  [EVENT_FIELDS.IS_IMAGE_EDITABLE]: boolean;
  [EVENT_FIELDS.IS_VERIFIED]: boolean;
  [EVENT_FIELDS.IS_UMBRELLA]: boolean;
  [EVENT_FIELDS.KEYWORDS]: string[];
  [EVENT_FIELDS.LOCATION]: string | null;
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: MultiLanguageObject;
  [EVENT_FIELDS.MAIN_CATEGORIES]: string[];
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: number | '';
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: number | '';
  [EVENT_FIELDS.NAME]: MultiLanguageObject;
  [EVENT_FIELDS.OFFERS]: Offer[];
  [EVENT_FIELDS.PROVIDER]: MultiLanguageObject;
  [EVENT_FIELDS.PUBLISHER]: string;
  [EVENT_FIELDS.RECURRING_EVENTS]: RecurringEventSettings[];
  [EVENT_FIELDS.RECURRING_EVENT_END_TIME]: Date | null;
  [EVENT_FIELDS.RECURRING_EVENT_START_TIME]: Date | null;
  [EVENT_FIELDS.SHORT_DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.SUPER_EVENT]: string | null;
  [EVENT_FIELDS.TYPE]: string;
  [EVENT_FIELDS.VIDEOS]: VideoDetails[];
};

type EventTimeFormFields = {
  [EVENT_TIME_FIELDS.END_DATE]: string;
  [EVENT_TIME_FIELDS.END_TIME]: string;
  [EVENT_TIME_FIELDS.START_DATE]: string;
  [EVENT_TIME_FIELDS.START_TIME]: string;
};

export type AddEventTimeFormFields = {
  [ADD_EVENT_TIME_FORM_NAME]: EventTimeFormFields;
};

export type EditEventTimeFormFields = {
  [EDIT_EVENT_TIME_FORM_NAME]: EventTimeFormFields;
};

export type EventTime = {
  [EVENT_TIME_FIELDS.END_TIME]: Date | null;
  [EVENT_TIME_FIELDS.ID]: string | null;
  [EVENT_TIME_FIELDS.START_TIME]: Date | null;
};

export type ExternalLink = {
  [EXTERNAL_LINK_FIELDS.LINK]: string;
  [EXTERNAL_LINK_FIELDS.NAME]: string;
};

export type ImageDetails = {
  [IMAGE_FIELDS.ALT_TEXT]: MultiLanguageObject;
  [IMAGE_FIELDS.LICENSE]: string;
  [IMAGE_FIELDS.NAME]: string;
  [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: string;
};

export type VideoDetails = {
  [VIDEO_DETAILS_FIELDS.ALT_TEXT]: string;
  [VIDEO_DETAILS_FIELDS.NAME]: string;
  [VIDEO_DETAILS_FIELDS.URL]: string;
};

export type Offer = {
  [EVENT_FIELDS.OFFER_DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.OFFER_INFO_URL]: MultiLanguageObject;
  [EVENT_FIELDS.OFFER_PRICE]: MultiLanguageObject;
};

export type RecurringEventSettings = {
  [RECURRING_EVENT_FIELDS.END_DATE]: string;
  [RECURRING_EVENT_FIELDS.END_TIME]: string;
  [RECURRING_EVENT_FIELDS.EVENT_TIMES]: EventTime[];
  [RECURRING_EVENT_FIELDS.REPEAT_DAYS]: string[];
  [RECURRING_EVENT_FIELDS.REPEAT_INTERVAL]: number;
  [RECURRING_EVENT_FIELDS.START_DATE]: string;
  [RECURRING_EVENT_FIELDS.START_TIME]: string;
};
