import {
  AtIdObject,
  Division,
  Event,
  ExternalLink,
  Image,
  Keyword,
  KeywordSet,
  Language,
  LocalisedObject,
  Meta,
  Offer,
  Place,
  Position,
} from '../../../generated/graphql';

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
        __typename: 'Image',
      }
    : null;

export const addTypenameAtIdObject = (
  item?: AtIdObject | null
): AtIdObject | null =>
  item
    ? {
        ...item,
        __typename: 'AtIdObject',
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
