import {
  DataSource,
  Division,
  Enrolment,
  Event,
  ExternalLink,
  Image,
  Keyword,
  KeywordSet,
  Language,
  LocalisedObject,
  Meta,
  Offer,
  Organization,
  OrganizationClass,
  Place,
  Position,
  Registration,
  User,
} from '../../../generated/graphql';
import { isFeatureEnabled } from '../../../utils/featureFlags';

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

export const addTypenameEnrolment = (
  enrolment?: Enrolment | null
): Enrolment | null =>
  enrolment
    ? {
        ...enrolment,
        __typename: 'Enrolment',
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
        externalLinks:
          event.externalLinks?.map((externalLink) =>
            addTypenameExternalLink(externalLink)
          ) || [],
        images: event.images?.map((image) => addTypenameImage(image)) || [],
        inLanguage:
          event.inLanguage?.map((language) => addTypenameLanguage(language)) ||
          [],
        keywords:
          event.keywords?.map((keyword) => addTypenameKeyword(keyword)) || [],
        audience:
          event.audience?.map((keyword) => addTypenameKeyword(keyword)) || [],
        location: addTypenamePlace(event.location),
        offers: event.offers?.map((offer) => addTypenameOffer(offer)) || [],
        superEvent: event.superEvent
          ? addTypenameEvent(event.superEvent)
          : null,
        subEvents:
          event.subEvents?.map((subEvent) => addTypenameEvent(subEvent)) || [],
        __typename: 'Event',
      }
    : null;

export const addTypenameExternalLink = (
  externalLink?: ExternalLink | null
): ExternalLink | null =>
  externalLink
    ? {
        ...externalLink,
        __typename: 'ExternalLink',
      }
    : null;

export const addTypenameImage = (image?: Image | null): Image | null =>
  image
    ? {
        ...image,
        altText: addTypenameLocalisedObject(
          // TODO: Remove LOCALIZED_IMAGE feature flag when localized image alt text
          // is deployed to production of API
          isFeatureEnabled('LOCALIZED_IMAGE')
            ? image.altText
            : { fi: image.altText as string }
        ),
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
        keywords:
          keywordSet.keywords?.map((keyword) => addTypenameKeyword(keyword)) ||
          [],
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
  item?: LocalisedObject | null
): LocalisedObject | null =>
  item
    ? {
        ...item,
        __typename: 'LocalisedObject',
      }
    : null;

export const addTypenameMeta = (meta: Meta): Meta => ({
  ...meta,
  __typename: 'Meta',
});

export const addTypenameOffer = (offer?: Offer | null): Offer | null =>
  offer
    ? {
        ...offer,
        description: addTypenameLocalisedObject(offer.description),
        infoUrl: addTypenameLocalisedObject(offer.infoUrl),
        price: addTypenameLocalisedObject(offer.price),
        __typename: 'Offer',
      }
    : null;

export const addTypenameOrganization = (
  organization?: Organization | null
): Organization | null =>
  organization
    ? {
        ...organization,
        __typename: 'Organization',
      }
    : null;

export const addTypenameOrganizationClass = (
  organizationClass?: OrganizationClass | null
): OrganizationClass | null =>
  organizationClass
    ? {
        ...organizationClass,
        __typename: 'OrganizationClass',
      }
    : null;

export const addTypenamePlace = (place?: Place | null): Place | null =>
  place
    ? {
        ...place,
        addressLocality: addTypenameLocalisedObject(place.addressLocality),
        divisions:
          place.divisions?.map((division) => addTypenameDivision(division)) ||
          [],
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
  position
    ? {
        ...position,
        __typename: 'Position',
      }
    : null;

export const addTypenameRegistration = (
  registration?: Registration | null
): Registration | null =>
  registration
    ? {
        ...registration,
        signups: Array.isArray(registration.signups)
          ? registration.signups.map((enrolment) =>
              addTypenameEnrolment(enrolment)
            )
          : [],
        __typename: 'Registration',
      }
    : null;

export const addTypenameUser = (user?: User | null): User | null =>
  user
    ? {
        ...user,
        __typename: 'User',
      }
    : null;
