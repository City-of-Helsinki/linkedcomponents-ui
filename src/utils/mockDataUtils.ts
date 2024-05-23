/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import addMinutes from 'date-fns/addMinutes';
import addSeconds from 'date-fns/addSeconds';
import { FormikState } from 'formik';
import merge from 'lodash/merge';

import { EXTLINK, FORM_NAMES, RESERVATION_NAMES } from '../constants';
import { TEST_DATA_SOURCE_ID } from '../domain/dataSource/constants';
import { TEST_PUBLISHER_ID } from '../domain/organization/constants';
import { TEST_ORGANIZATION_CLASS_ID } from '../domain/organizationClass/constants';
import { TEST_REGISTRATION_ID } from '../domain/registration/constants';
import { TEST_SEATS_RESERVATION_CODE } from '../domain/seatsReservation/constants';
import {
  NOTIFICATION_TYPE,
  SIGNUP_GROUP_INITIAL_VALUES,
} from '../domain/signupGroup/constants';
import { SignupGroupFormFields } from '../domain/signupGroup/types';
import {
  AttendeeStatus,
  ContactPerson,
  CreateSignupGroupResponse,
  DataSource,
  DataSourcesResponse,
  Event,
  EventsResponse,
  EventStatus,
  EventTypeId,
  ExternalLink,
  Feedback,
  Image,
  ImagesResponse,
  Keyword,
  KeywordSet,
  KeywordSetsResponse,
  KeywordsResponse,
  Language,
  LanguagesResponse,
  LocalisedObject,
  Meta,
  Offer,
  OfferPriceGroup,
  Organization,
  OrganizationClass,
  OrganizationClassesResponse,
  OrganizationsResponse,
  Place,
  PlacesResponse,
  PresenceStatus,
  PriceGroup,
  PriceGroupDense,
  PriceGroupsResponse,
  PublicationStatus,
  Registration,
  RegistrationFieldsFragment,
  RegistrationPriceGroup,
  RegistrationsResponse,
  RegistrationUserAccess,
  SeatsReservation,
  SendMessageResponse,
  Signup,
  SignupGroup,
  SignupPriceGroup,
  SignupsResponse,
  User,
  UsersResponse,
  Video,
  WebStoreAccount,
  WebStoreMerchant,
} from '../generated/graphql';
import generateAtId from './generateAtId';

export const fakeContactPerson = (
  overrides?: Partial<ContactPerson>
): ContactPerson => {
  const id = overrides?.id || faker.string.uuid();

  return merge<ContactPerson, typeof overrides>(
    {
      id,
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      membershipNumber: faker.string.uuid(),
      nativeLanguage: 'fi',
      notifications: NOTIFICATION_TYPE.SMS_EMAIL,
      phoneNumber: faker.phone.number(),
      serviceLanguage: 'fi',
      __typename: 'ContactPerson',
    },
    overrides
  );
};

export const fakeDataSources = (
  count = 1,
  dataSources?: Partial<DataSource>[]
): DataSourcesResponse => ({
  data: generateNodeArray((i) => fakeDataSource(dataSources?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'DataSourcesResponse',
});

export const fakeDataSource = (overrides?: Partial<DataSource>): DataSource => {
  const id = overrides?.id || faker.string.uuid();

  return merge<DataSource, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'data_source'),
      apiKey: '',
      createPastEvents: false,
      editPastEvents: false,
      name: faker.lorem.words(),
      owner: null,
      private: false,
      userEditable: false,
      __typename: 'DataSource',
    },
    overrides
  );
};

export const fakeCreateSignupGroupResponse = (
  overrides?: Partial<CreateSignupGroupResponse>
): CreateSignupGroupResponse => {
  const id = overrides?.id || faker.string.uuid();

  return merge<CreateSignupGroupResponse, typeof overrides>(
    {
      id,
      extraInfo: '',
      registration: TEST_REGISTRATION_ID,
      signups: [],
    },

    overrides
  );
};

export const fakeEvents = (
  count = 1,
  events?: Partial<Event>[]
): EventsResponse => ({
  data: generateNodeArray((i) => fakeEvent(events?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'EventsResponse',
});

export const fakeEvent = (overrides?: Partial<Event>): Event => {
  const id = overrides?.id || faker.string.uuid();

  return merge<Event, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'event'),
      audience: [],
      audienceMaxAge: null,
      audienceMinAge: null,
      createdBy: null,
      dataSource: 'hel',
      datePublished: null,
      deleted: null,
      description: fakeLocalisedObject(),
      endTime: null,
      enrolmentEndTime: null,
      enrolmentStartTime: null,
      environment: 'in',
      environmentalCertificate: '',
      eventStatus: EventStatus.EventScheduled,
      externalLinks: [],
      images: [],
      infoUrl: fakeLocalisedObject(),
      inLanguage: [],
      keywords: [],
      lastModifiedTime: '2020-07-13T05:51:05.761000Z',
      location: fakePlace(),
      locationExtraInfo: fakeLocalisedObject(faker.location.streetAddress()),
      maximumAttendeeCapacity: null,
      minimumAttendeeCapacity: null,
      name: fakeLocalisedObject(faker.lorem.text()),
      offers: [],
      provider: fakeLocalisedObject(),
      publicationStatus: PublicationStatus.Public,
      publisher: TEST_PUBLISHER_ID,
      registration: { atId: null },
      shortDescription: fakeLocalisedObject(),
      startTime: '2020-07-13T05:51:05.761000Z',
      subEvents: [],
      superEvent: null,
      superEventType: null,
      userConsent: false,
      userEmail: '',
      userName: '',
      userOrganization: '',
      userPhoneNumber: '',
      typeId: EventTypeId.General,
      videos: [],
      __typename: 'Event',
    },
    overrides
  );
};

export const fakeExternalLink = (
  overrides?: Partial<ExternalLink>
): ExternalLink =>
  merge<ExternalLink, typeof overrides>(
    {
      link: faker.internet.url(),
      name: EXTLINK.EXTLINK_FACEBOOK,
      __typename: 'ExternalLink',
    },
    overrides
  );

export const fakeFeedback = (overrides?: Partial<Feedback>): Feedback =>
  merge<Feedback, typeof overrides>(
    {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      subject: faker.lorem.text(),
      body: faker.internet.exampleEmail(),
      __typename: 'Feedback',
    },
    overrides
  );

export const fakeImages = (
  count = 1,
  images?: Partial<Image>[]
): ImagesResponse => ({
  data: generateNodeArray((i) => fakeImage(images?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'ImagesResponse',
});

export const fakeImage = (overrides?: Partial<Image>): Image => {
  const id = overrides?.id || faker.string.uuid();

  return merge<Image, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'image'),
      altText: fakeLocalisedObject(faker.lorem.words()),
      lastModifiedTime: null,
      license: 'cc_by',
      name: faker.lorem.words(),
      url: faker.internet.url(),
      cropping: '59,0,503,444',
      photographerName: faker.person.firstName(),
      publisher: TEST_PUBLISHER_ID,
      __typename: 'Image',
    },
    overrides
  );
};

export const fakeKeywords = (
  count = 1,
  keywords?: Partial<Keyword>[]
): KeywordsResponse => ({
  data: generateNodeArray((i) => fakeKeyword(keywords?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'KeywordsResponse',
});

export const fakeKeyword = (overrides?: Partial<Keyword>): Keyword => {
  const id = overrides?.id || faker.string.uuid();

  return merge<Keyword, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'keyword'),
      dataSource: 'yso',
      deprecated: false,
      hasUpcomingEvents: true,
      name: fakeLocalisedObject(),
      nEvents: 0,
      publisher: TEST_PUBLISHER_ID,
      replacedBy: null,
      __typename: 'Keyword',
    },
    overrides
  );
};

export const fakeKeywordSets = (
  count = 1,
  keywordSets?: Partial<KeywordSet>[]
): KeywordSetsResponse => ({
  data: generateNodeArray((i) => fakeKeywordSet(keywordSets?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'KeywordSetsResponse',
});

export const fakeKeywordSet = (overrides?: Partial<KeywordSet>): KeywordSet => {
  const id = overrides?.id || faker.string.uuid();

  return merge<KeywordSet, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'keyword_set'),
      dataSource: TEST_DATA_SOURCE_ID,
      keywords: [],
      name: fakeLocalisedObject(),
      organization: TEST_PUBLISHER_ID,
      usage: 'any',
      __typename: 'KeywordSet',
    },
    overrides
  );
};

export const fakeLanguages = (
  count = 1,
  languages?: Partial<Language>[]
): LanguagesResponse => ({
  data: generateNodeArray((i) => fakeLanguage(languages?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'LanguagesResponse',
});

export const fakeLanguage = (overrides?: Partial<Language>): Language => {
  const id = overrides?.id || faker.string.uuid();

  return merge<Language, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'language'),
      serviceLanguage: false,
      translationAvailable: false,
      name: fakeLocalisedObject(),
      __typename: 'Language',
    },
    overrides
  );
};

export const fakeOfferPriceGroup = (
  overrides?: Partial<OfferPriceGroup>
): OfferPriceGroup => {
  const id = overrides?.id ?? faker.number.int();

  return merge<OfferPriceGroup, typeof overrides>(
    {
      id,
      price: faker.string.numeric(),
      priceGroup: fakePriceGroupDense(),
      priceWithoutVat: faker.string.numeric(),
      vat: faker.string.numeric(),
      vatPercentage: '24.00',
      __typename: 'OfferPriceGroup',
    },
    overrides
  );
};

export const fakeOfferPriceGroups = (
  count = 1,
  offerPriceGroups?: Partial<OfferPriceGroup>[]
): OfferPriceGroup[] =>
  generateNodeArray((i) => fakeOfferPriceGroup(offerPriceGroups?.[i]), count);

export const fakeOffer = (overrides?: Partial<Offer>): Offer =>
  merge(
    {
      description: fakeLocalisedObject(),
      infoUrl: fakeLocalisedObject(faker.internet.url()),
      isFree: false,
      offerPriceGroups: [],
      price: fakeLocalisedObject(),
      __typename: 'Offer',
    },
    overrides
  );

export const fakeOffers = (count = 1, offers?: Partial<Offer>[]): Offer[] =>
  generateNodeArray((i) => fakeOffer(offers?.[i]), count);

export const fakeOrganization = (
  overrides?: Partial<Organization>
): Organization => {
  const id = overrides?.id || faker.string.uuid();
  return merge<Organization, typeof overrides>(
    {
      adminUsers: [],
      affiliatedOrganizations: [],
      id,
      atId: generateAtId(id, 'organization'),
      classification: TEST_ORGANIZATION_CLASS_ID,
      createdTime: null,
      dataSource: TEST_DATA_SOURCE_ID,
      dissolutionDate: null,
      financialAdminUsers: [],
      foundingDate: '2021-01-01',
      hasRegularUsers: false,
      isAffiliated: false,
      lastModifiedTime: null,
      name: faker.lorem.words(),
      parentOrganization: null,
      replacedBy: null,
      registrationAdminUsers: [],
      regularUsers: [],
      subOrganizations: [],
      webStoreAccounts: [],
      webStoreMerchants: [],
      __typename: 'Organization',
    },
    overrides
  );
};

export const fakeOrganizations = (
  count = 1,
  organizations?: Partial<Organization>[]
): OrganizationsResponse => ({
  data: generateNodeArray((i) => fakeOrganization(organizations?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'OrganizationsResponse',
});

export const fakeOrganizationClasses = (
  count = 1,
  organizationClasses?: Partial<OrganizationClass>[]
): OrganizationClassesResponse => ({
  data: generateNodeArray(
    (i) => fakeOrganizationClass(organizationClasses?.[i]),
    count
  ),
  meta: fakeMeta(count),
  __typename: 'OrganizationClassesResponse',
});

export const fakeOrganizationClass = (
  overrides?: Partial<OrganizationClass>
): OrganizationClass => {
  const id = overrides?.id || faker.string.uuid();
  return merge<OrganizationClass, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'organization_class'),
      createdTime: null,
      dataSource: TEST_DATA_SOURCE_ID,
      lastModifiedTime: null,
      name: faker.lorem.words(),
      __typename: 'OrganizationClass',
    },
    overrides
  );
};

export const fakePlaces = (
  count = 1,
  places?: Partial<Place>[]
): PlacesResponse => ({
  data: generateNodeArray((i) => fakePlace(places?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'PlacesResponse',
});

export const fakePlace = (overrides?: Partial<Place>): Place => {
  const id = overrides?.id || faker.string.uuid();

  return merge<Place, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'place'),
      addressLocality: fakeLocalisedObject(),
      addressRegion: '',
      contactType: '',
      dataSource: 'tprek',
      description: fakeLocalisedObject(),
      divisions: [],
      email: faker.internet.email(),
      hasUpcomingEvents: true,
      infoUrl: fakeLocalisedObject(faker.internet.url()),
      name: fakeLocalisedObject(),
      nEvents: 0,
      position: null,
      postalCode: faker.location.zipCode(),
      postOfficeBoxNum: '',
      publisher: TEST_PUBLISHER_ID,
      streetAddress: fakeLocalisedObject(),
      telephone: fakeLocalisedObject(),
      __typename: 'Place',
    },
    overrides
  );
};

export const fakePriceGroups = (
  count = 1,
  priceGroups?: Partial<PriceGroup>[]
): PriceGroupsResponse => ({
  data: generateNodeArray((i) => fakePriceGroup(priceGroups?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'PriceGroupsResponse',
});

export const fakePriceGroup = (overrides?: Partial<PriceGroup>): PriceGroup => {
  const id = overrides?.id || faker.number.int();

  return merge<PriceGroup, typeof overrides>(
    {
      id,
      createdBy: faker.person.firstName(),
      createdTime: null,
      description: fakeLocalisedObject(),
      isFree: false,
      lastModifiedBy: faker.person.firstName(),
      lastModifiedTime: '2020-09-12T15:00:00.000000Z',
      publisher: TEST_PUBLISHER_ID,
      __typename: 'PriceGroup',
    },
    overrides
  );
};

export const fakePriceGroupDense = (
  overrides?: Partial<PriceGroupDense>
): PriceGroupDense => {
  const id = overrides?.id || faker.number.int();

  return merge<PriceGroupDense, typeof overrides>(
    {
      id,
      description: fakeLocalisedObject(),
      __typename: 'PriceGroupDense',
    },
    overrides
  );
};

export const fakeRegistrationPriceGroup = (
  overrides?: Partial<RegistrationPriceGroup>
): RegistrationPriceGroup => {
  const id = overrides?.id || faker.number.int();

  return merge<RegistrationPriceGroup, typeof overrides>(
    {
      id,
      price: faker.string.numeric(),
      priceGroup: fakePriceGroupDense(),
      priceWithoutVat: faker.string.numeric(),
      vat: faker.string.numeric(),
      vatPercentage: '24.00',
      __typename: 'RegistrationPriceGroup',
    },
    overrides
  );
};

export const fakeRegistrations = (
  count = 1,
  registrations?: Partial<Registration>[]
): RegistrationsResponse => ({
  data: generateNodeArray((i) => fakeRegistration(registrations?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'RegistrationsResponse',
});

export const fakeRegistration = (
  overrides?: Partial<Registration>
): Registration => {
  const id = overrides?.id || faker.string.uuid();

  return merge<Registration, typeof overrides>(
    {
      id,
      atId: generateAtId(id, 'registration'),
      audienceMaxAge: null,
      audienceMinAge: null,
      confirmationMessage: fakeLocalisedObject(faker.lorem.paragraph()),
      createdBy: faker.person.firstName(),
      createdTime: null,
      currentAttendeeCount: 0,
      currentWaitingListCount: 0,
      dataSource: TEST_DATA_SOURCE_ID,
      enrolmentEndTime: '2020-09-30T16:00:00.000000Z',
      enrolmentStartTime: '2020-09-27T15:00:00.000000Z',
      event: null,
      hasRegistrationUserAccess: false,
      hasSubstituteUserAccess: false,
      instructions: fakeLocalisedObject(faker.lorem.paragraph()),
      isCreatedByCurrentUser: false,
      lastModifiedBy: faker.person.firstName(),
      lastModifiedTime: '2020-09-12T15:00:00.000000Z',
      mandatoryFields: [],
      maximumAttendeeCapacity: 0,
      maximumGroupSize: null,
      minimumAttendeeCapacity: 0,
      registrationPriceGroups: [],
      registrationUserAccesses: [],
      remainingAttendeeCapacity: 0,
      remainingWaitingListCapacity: 0,
      publisher: TEST_PUBLISHER_ID,
      signups: [],
      waitingListCapacity: 0,
      __typename: 'Registration',
    },
    overrides
  );
};

export const fakeRegistrationUserAccess = (
  overrides?: Partial<RegistrationUserAccess>
): RegistrationUserAccess => {
  const id = overrides?.id || faker.number.int();

  return merge<RegistrationUserAccess, typeof overrides>(
    {
      id,
      email: faker.internet.email(),
      isSubstituteUser: false,
      language: null,
      __typename: 'RegistrationUserAccess',
    },
    overrides
  );
};

export const fakeSeatsReservation = (
  overrides?: Partial<SeatsReservation>
): SeatsReservation => {
  const id = overrides?.id || faker.string.uuid();
  const timestamp = new Date().toISOString();

  return merge<SeatsReservation, typeof overrides>(
    {
      id,
      code: TEST_SEATS_RESERVATION_CODE,
      expiration: addMinutes(new Date(timestamp), 30).toISOString(),
      inWaitlist: false,
      registration: TEST_REGISTRATION_ID,
      seats: 1,
      timestamp,
    },
    overrides
  );
};

export const fakeSendMessageResponse = (
  overrides?: Partial<SendMessageResponse>
): SendMessageResponse =>
  merge<SendMessageResponse, typeof overrides>(
    {
      htmlMessage: faker.lorem.sentence(),
      message: faker.lorem.sentence(),
      signups: [],
      subject: faker.lorem.sentence(),
      __typename: 'SendMessageResponse',
    },
    overrides
  );

export const fakeSignupPriceGroup = (
  overrides?: Partial<SignupPriceGroup>
): SignupPriceGroup => {
  const id = overrides?.id || faker.number.int();

  return merge<SignupPriceGroup, typeof overrides>(
    {
      id,
      price: faker.string.numeric(),
      priceGroup: fakePriceGroupDense(),
      priceWithoutVat: faker.string.numeric(),
      registrationPriceGroup: faker.number.int(),
      vat: faker.string.numeric(),
      vatPercentage: '24.00',
      __typename: 'SignupPriceGroup',
    },
    overrides
  );
};

export const fakeSignups = (
  count = 1,
  signups?: Partial<Signup>[]
): SignupsResponse => ({
  data: generateNodeArray((i) => fakeSignup(signups?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'SignupsResponse',
});

export const fakeSignup = (overrides?: Partial<Signup>): Signup => {
  const id = overrides?.id || faker.string.uuid();

  return merge<Signup, typeof overrides>(
    {
      id,
      attendeeStatus: AttendeeStatus.Attending,
      city: faker.location.city(),
      contactPerson: fakeContactPerson(),
      createdBy: null,
      createdTime: null,
      dateOfBirth: '1990-10-10',
      extraInfo: faker.lorem.paragraph(),
      firstName: faker.person.firstName(),
      lastModifiedBy: null,
      lastModifiedTime: null,
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      priceGroup: null,
      presenceStatus: PresenceStatus.NotPresent,
      signupGroup: null,
      streetAddress: faker.location.streetAddress(),
      zipcode: faker.location.zipCode('#####'),
      __typename: 'Signup',
    },
    overrides
  );
};

export const fakeSignupGroup = (
  overrides?: Partial<SignupGroup>
): SignupGroup => {
  const id = overrides?.id || faker.string.uuid();

  return merge<SignupGroup, typeof overrides>(
    {
      id,
      contactPerson: fakeContactPerson(),
      createdBy: null,
      createdTime: null,
      extraInfo: '',
      lastModifiedBy: null,
      lastModifiedTime: null,
      registration: TEST_REGISTRATION_ID,
      signups: [],
    },
    overrides
  );
};

export const fakeUsers = (
  count = 1,
  users?: Partial<User>[]
): UsersResponse => ({
  data: generateNodeArray((i) => fakeUser(users?.[i]), count),
  meta: fakeMeta(count),
  __typename: 'UsersResponse',
});

export const fakeUser = (overrides?: Partial<User>): User => {
  return merge<User, typeof overrides>(
    {
      adminOrganizations: [],
      dateJoined: null,
      departmentName: faker.lorem.words(),
      displayName: faker.lorem.words(),
      email: faker.internet.email(),
      financialAdminOrganizations: [],
      firstName: faker.person.firstName(),
      isExternal: false,
      isStaff: false,
      isSubstituteUser: false,
      isSuperuser: false,
      lastLogin: '',
      lastName: faker.person.lastName(),
      organization: faker.lorem.words(),
      organizationMemberships: [],
      registrationAdminOrganizations: [],
      username: faker.string.uuid(),
      uuid: faker.string.uuid(),
      __typename: 'User',
    },
    overrides
  );
};

export const fakeVideo = (overrides?: Partial<Video>): Video =>
  merge<Video, typeof overrides>(
    {
      altText: faker.lorem.words(),
      name: faker.lorem.word(),
      url: faker.image.url(),
      __typename: 'Video',
    },
    overrides
  );

export const fakeWebStoreAccount = (
  overrides?: Partial<WebStoreAccount>
): WebStoreAccount =>
  merge<WebStoreAccount, typeof overrides>(
    {
      active: false,
      balanceProfitCenter: faker.string.numeric({ length: 2 }),
      companyCode: faker.string.numeric({ length: 2 }),
      createdBy: null,
      createdTime: null,
      id: faker.number.int(),
      internalOrder: faker.string.numeric({ length: 2 }),
      lastModifiedBy: null,
      lastModifiedTime: null,
      mainLedgerAccount: faker.string.numeric({ length: 2 }),
      operationArea: faker.string.numeric({ length: 2 }),
      profitCenter: faker.string.numeric({ length: 2 }),
      project: faker.string.numeric({ length: 2 }),
      vatCode: faker.string.numeric({ length: 8 }),
      __typename: 'WebStoreAccount',
    },
    overrides
  );

export const fakeWebStoreMerchant = (
  overrides?: Partial<WebStoreMerchant>
): WebStoreMerchant =>
  merge<WebStoreMerchant, typeof overrides>(
    {
      active: false,
      businessId: faker.string.numeric({ length: 8 }),
      city: faker.location.city(),
      createdBy: null,
      createdTime: null,
      email: faker.internet.email(),
      id: faker.number.int(),
      lastModifiedBy: null,
      lastModifiedTime: null,
      merchantId: faker.string.uuid(),
      name: faker.lorem.word(),
      paytrailMerchantId: faker.string.uuid(),
      phoneNumber: faker.phone.number(),
      streetAddress: faker.location.streetAddress(),
      termsOfServiceUrl: faker.image.url(),
      zipcode: faker.location.zipCode(),
      __typename: 'WebStoreMerchant',
    },
    overrides
  );

export const fakeLocalisedObject = (text?: string): LocalisedObject => ({
  __typename: 'LocalisedObject',
  ar: faker.lorem.words(),
  en: faker.lorem.words(),
  fi: text || faker.lorem.words(),
  ru: faker.lorem.words(),
  sv: faker.lorem.words(),
  zhHans: faker.lorem.words(),
});

export const fakeMeta = (count = 1, overrides?: Partial<Meta>): Meta =>
  merge<Meta, typeof overrides>(
    {
      __typename: 'Meta',
      count: count,
      next: '',
      previous: '',
    },
    overrides
  );

const generateNodeArray = <T extends (...args: any) => any>(
  fakeFunc: T,
  length: number
): ReturnType<T>[] => {
  return Array.from({ length }).map((_, i) => fakeFunc(i));
};

export const setSignupGroupFormSessionStorageValues = ({
  registrationId,
  seatsReservation,
  signupGroupFormValues,
}: {
  registrationId: string;
  seatsReservation?: SeatsReservation;
  signupGroupFormValues?: Partial<SignupGroupFormFields>;
}) => {
  if (seatsReservation) {
    const reservationKey = `${RESERVATION_NAMES.SEATS_RESERVATION}-${registrationId}`;
    sessionStorage.setItem(reservationKey, JSON.stringify(seatsReservation));
  }
  if (signupGroupFormValues) {
    const key = `${FORM_NAMES.CREATE_SIGNUP_GROUP_FORM}-${registrationId}`;
    sessionStorage.setItem(
      key,
      JSON.stringify({
        errors: {},
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
        touched: {},
        values: {
          ...SIGNUP_GROUP_INITIAL_VALUES,
          ...signupGroupFormValues,
        },
      } as FormikState<SignupGroupFormFields>)
    );
  }
};

export const getMockedSeatsReservationData = (expirationOffset: number) => {
  const now = new Date();
  const expiration = addSeconds(now, expirationOffset).toISOString();

  return fakeSeatsReservation({ expiration });
};

export const setSessionStorageValues = (
  reservation: SeatsReservation,
  registration: RegistrationFieldsFragment
) => {
  const reservationKey = `${RESERVATION_NAMES.SEATS_RESERVATION}-${registration.id}`;
  sessionStorage.setItem(reservationKey, JSON.stringify(reservation));
};
