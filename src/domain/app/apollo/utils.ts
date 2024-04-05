import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import {
  ContactPerson,
  DataSource,
  Division,
  Event,
  ExternalLink,
  IdObject,
  Image,
  Keyword,
  KeywordSet,
  Language,
  LocalisedObject,
  Meta,
  Offer,
  OfferPriceGroup,
  Organization,
  OrganizationClass,
  Place,
  Position,
  PriceGroup,
  PriceGroupDense,
  Registration,
  RegistrationPriceGroup,
  RegistrationUserAccess,
  Signup,
  SignupGroup,
  SignupPriceGroup,
  User,
  WebStoreAccount,
  WebStoreMerchant,
} from '../../../generated/graphql';
import getValue from '../../../utils/getValue';

export const addTypenameContactPerson = (
  contacPerson?: ContactPerson | null
): ContactPerson | null =>
  contacPerson
    ? {
        ...contacPerson,
        __typename: 'ContactPerson',
      }
    : null;

export const addTypenameDataSource = (
  dataSource?: DataSource | null
): DataSource | null =>
  dataSource
    ? {
        ...dataSource,
        __typename: 'DataSource',
      }
    : null;

export const addTypenameDivision = (
  division?: Division | null
): Division | null =>
  division
    ? {
        ...division,
        name: addTypenameLocalisedObject(division.name),
        __typename: 'Division',
      }
    : null;

export const addTypenameEvent = (event?: Event | null): Event | null =>
  event
    ? {
        ...event,
        description: addTypenameLocalisedObject(event.description),
        infoUrl: addTypenameLocalisedObject(event.infoUrl),
        name: addTypenameLocalisedObject(event.name),
        provider: addTypenameLocalisedObject(event.provider),
        shortDescription: addTypenameLocalisedObject(event.shortDescription),
        externalLinks: getValue(event.externalLinks, [])?.map((externalLink) =>
          addTypenameExternalLink(externalLink)
        ),
        images: getValue(
          event.images?.map((image) => addTypenameImage(image)),
          []
        ),
        inLanguage: getValue(
          event.inLanguage?.map((language) => addTypenameLanguage(language)),
          []
        ),
        keywords: getValue(
          event.keywords?.map((keyword) => addTypenameKeyword(keyword)),
          []
        ),
        audience: getValue(
          event.audience?.map((keyword) => addTypenameKeyword(keyword)),
          []
        ),
        location: addTypenamePlace(event.location),
        offers: getValue(
          event.offers?.map((offer) => addTypenameOffer(offer)),
          []
        ),
        registration: addTypenameIdObject(event.registration),
        superEvent: event.superEvent
          ? addTypenameEvent(event.superEvent)
          : null,
        subEvents: getValue(
          event.subEvents?.map((subEvent) => addTypenameEvent(subEvent)),
          []
        ),
        __typename: 'Event',
      }
    : null;

export const addTypenameExternalLink = (
  externalLink?: ExternalLink | null
): ExternalLink | null =>
  externalLink ? { ...externalLink, __typename: 'ExternalLink' } : null;

export const addTypenameIdObject = (
  idObject?: IdObject | null
): IdObject | null =>
  idObject ? { ...idObject, __typename: 'IdObject' } : null;

export const addTypenameImage = (image?: Image | null): Image | null =>
  image
    ? {
        ...image,
        altText: addTypenameLocalisedObject(image.altText),
        __typename: 'Image',
      }
    : null;

export const addTypenameKeyword = (keyword?: Keyword | null): Keyword | null =>
  keyword
    ? {
        ...keyword,
        name: addTypenameLocalisedObject(keyword?.name),
        __typename: 'Keyword',
      }
    : null;

export const addTypenameKeywordSet = (
  keywordSet?: KeywordSet | null
): KeywordSet | null =>
  keywordSet
    ? {
        ...keywordSet,
        keywords: getValue(
          keywordSet.keywords?.map((keyword) => addTypenameKeyword(keyword)),
          []
        ),
        name: addTypenameLocalisedObject(keywordSet?.name),
        __typename: 'KeywordSet',
      }
    : null;

export const addTypenameLanguage = (
  language?: Language | null
): Language | null =>
  language
    ? {
        ...language,
        name: addTypenameLocalisedObject(language?.name),
        __typename: 'Language',
      }
    : null;

export const addTypenameLocalisedObject = (
  item?: string | LocalisedObject | null
): LocalisedObject | null =>
  item
    ? {
        ...(typeof item === 'string'
          ? { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: item }
          : item),
        __typename: 'LocalisedObject',
      }
    : null;

export const addTypenameMeta = (meta: Meta): Meta => ({
  ...meta,
  __typename: 'Meta',
});

export const addTypenameOfferPriceGroup = (
  offerPriceGroup?: OfferPriceGroup | null
): OfferPriceGroup | null =>
  offerPriceGroup
    ? {
        ...offerPriceGroup,
        priceGroup: addTypenamePriceGroupDense(offerPriceGroup.priceGroup),
        __typename: 'OfferPriceGroup',
      }
    : null;

export const addTypenameOffer = (offer?: Offer | null): Offer | null =>
  offer
    ? {
        ...offer,
        description: addTypenameLocalisedObject(offer.description),
        infoUrl: addTypenameLocalisedObject(offer.infoUrl),
        price: addTypenameLocalisedObject(offer.price),
        offerPriceGroups: offer.offerPriceGroups?.map((i) =>
          addTypenameOfferPriceGroup(i)
        ),
        __typename: 'Offer',
      }
    : null;

export const addTypenameOrganization = (
  organization?: Organization | null
): Organization | null =>
  organization
    ? {
        ...organization,
        webStoreAccounts:
          organization.webStoreAccounts?.map((o) =>
            addTypenameWebStoreAccount(o)
          ) ?? [],
        webStoreMerchants:
          organization.webStoreMerchants?.map((o) =>
            addTypenameWebStoreMerchant(o)
          ) ?? [],
        __typename: 'Organization',
      }
    : null;

export const addTypenameOrganizationClass = (
  organizationClass?: OrganizationClass | null
): OrganizationClass | null =>
  organizationClass
    ? { ...organizationClass, __typename: 'OrganizationClass' }
    : null;

export const addTypenamePlace = (place?: Place | null): Place | null =>
  place
    ? {
        ...place,
        addressLocality: addTypenameLocalisedObject(place.addressLocality),
        divisions: getValue(
          place.divisions?.map((division) => addTypenameDivision(division)),
          []
        ),
        infoUrl: addTypenameLocalisedObject(place.infoUrl),
        name: addTypenameLocalisedObject(place.name),
        position: addTypenamePosition(place.position),
        streetAddress: addTypenameLocalisedObject(place.streetAddress),
        telephone: addTypenameLocalisedObject(place.telephone),
        __typename: 'Place',
      }
    : null;

export const addTypenamePosition = (
  position?: Position | null
): Position | null =>
  position ? { ...position, __typename: 'Position' } : null;

export const addTypenamePriceGroup = (
  priceGroup?: PriceGroup | null
): PriceGroup | null =>
  priceGroup
    ? {
        ...priceGroup,
        description: addTypenameLocalisedObject(priceGroup.description),
        __typename: 'PriceGroup',
      }
    : null;

export const addTypenamePriceGroupDense = (
  priceGroup?: PriceGroupDense | null
): PriceGroupDense | null =>
  priceGroup
    ? {
        ...priceGroup,
        description: addTypenameLocalisedObject(priceGroup.description),
        __typename: 'PriceGroupDense',
      }
    : null;

export const addTypenameRegistrationPriceGroup = (
  registrationPriceGroup?: RegistrationPriceGroup | null
): RegistrationPriceGroup | null =>
  registrationPriceGroup
    ? {
        ...registrationPriceGroup,
        priceGroup: addTypenamePriceGroupDense(
          registrationPriceGroup.priceGroup
        ),
        __typename: 'RegistrationPriceGroup',
      }
    : null;

export const addTypenameRegistrationUserAccess = (
  registrationUserAccess?: RegistrationUserAccess | null
): RegistrationUserAccess | null =>
  registrationUserAccess
    ? { ...registrationUserAccess, __typename: 'RegistrationUserAccess' }
    : null;

export const addTypenameRegistration = (
  registration?: Registration | null
): Registration | null =>
  registration
    ? {
        ...registration,
        confirmationMessage: addTypenameLocalisedObject(
          registration?.confirmationMessage
        ),
        event: addTypenameEvent(registration?.event),
        instructions: addTypenameLocalisedObject(registration?.instructions),
        registrationPriceGroups: registration.registrationPriceGroups?.map(
          (pg) => addTypenameRegistrationPriceGroup(pg)
        ),
        registrationUserAccesses: registration.registrationUserAccesses?.map(
          (ru) => addTypenameRegistrationUserAccess(ru)
        ),
        signups: Array.isArray(registration.signups)
          ? registration.signups.map((signup) => addTypenameSignup(signup))
          : [],
        __typename: 'Registration',
      }
    : null;

export const addTypenameSignupPriceGroup = (
  signupPriceGroup?: SignupPriceGroup | null
): SignupPriceGroup | null =>
  signupPriceGroup
    ? {
        ...signupPriceGroup,
        priceGroup: addTypenamePriceGroupDense(signupPriceGroup.priceGroup),
        __typename: 'SignupPriceGroup',
      }
    : null;

export const addTypenameSignup = (signup?: Signup | null): Signup | null =>
  signup
    ? {
        ...signup,
        contactPerson: addTypenameContactPerson(signup.contactPerson),
        priceGroup: addTypenameSignupPriceGroup(signup.priceGroup),
        __typename: 'Signup',
      }
    : null;

export const addTypenameSignupGroup = (
  signupGroup?: SignupGroup | null
): SignupGroup | null =>
  signupGroup
    ? {
        ...signupGroup,
        contactPerson: addTypenameContactPerson(signupGroup.contactPerson),
        signups: Array.isArray(signupGroup.signups)
          ? signupGroup.signups.map((signup) => addTypenameSignup(signup))
          : [],
        __typename: 'SignupGroup',
      }
    : null;

export const addTypenameUser = (user?: User | null): User | null =>
  user ? { ...user, __typename: 'User' } : null;

export const addTypenameWebStoreAccount = (
  webStoreAccount?: WebStoreAccount | null
): WebStoreAccount | null =>
  webStoreAccount
    ? { ...webStoreAccount, __typename: 'WebStoreAccount' }
    : null;

export const addTypenameWebStoreMerchant = (
  webStoreMerchant?: WebStoreMerchant | null
): WebStoreMerchant | null =>
  webStoreMerchant
    ? { ...webStoreMerchant, __typename: 'WebStoreMerchant' }
    : null;
