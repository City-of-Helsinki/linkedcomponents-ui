import { TFunction } from 'i18next';
import isEmpty from 'lodash/isEmpty';

import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import { LEServerError, OptionType, ServerErrorItem } from '../../../types';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import pascalCase from '../../../utils/pascalCase';
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

export const parseEventServerErrors = ({
  eventType,
  result,
  t,
}: {
  eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any> | Record<string, any>[] | string;
  t: TFunction;
}): ServerErrorItem[] => {
  // LE returns errors as array when trying to create/edit multiple events in same request.
  // In that case call parseEventServerErrors recursively to get all single errors
  if (Array.isArray(result)) {
    return result.reduce(
      (previous: ServerErrorItem[], r) => [
        ...previous,
        ...parseEventServerErrors({ eventType, result: r, t }),
      ],
      []
    );
  }

  return typeof result === 'string'
    ? [{ label: '', message: parseEventServerErrorMessage([result]) }]
    : Object.entries(result).reduce(
        (previous: ServerErrorItem[], [key, error]) => [
          ...previous,
          ...parseEventServerError({ error, key }),
        ],
        []
      );

  // Get error item for an single error. Also get all errors for nested fields (description,
  // short_description, videos)
  function parseEventServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    switch (key) {
      case 'description':
      case 'short_description':
        return parseLocalizedServerError({ error, key });
      case 'external_links':
        return parseExternalLinkServerError({ error, key });
      case 'videos':
        return parseVideoServerError(error);
      default:
        return [
          {
            label: parseEventServerErrorLabel({ key }),
            message: parseEventServerErrorMessage(error),
          },
        ];
    }
  }

  // LE returns description and short_description fields as localized object.
  // Get error items for each language
  function parseLocalizedServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }): ServerErrorItem[] {
    /* istanbul ignore else */
    if (typeof error === 'object') {
      return Object.entries(error).reduce(
        (previous: ServerErrorItem[], [lang, e]) => [
          ...previous,
          {
            label: parseEventServerErrorLabel({
              key,
              langText: lowerCaseFirstLetter(t(`form.inLanguage.${lang}`)),
            }),
            message: parseEventServerErrorMessage([e as string]),
          },
        ],
        []
      );
    } else {
      return [];
    }
  }

  // Get error items for video fields
  function parseExternalLinkServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }): ServerErrorItem[] {
    /* istanbul ignore else */
    if (Array.isArray(error)) {
      return error
        .filter((e) => !isEmpty(e))
        .map((e) => ({
          label: parseEventServerErrorLabel({ key }),
          message: parseEventServerErrorMessage({ error: e.link as string[] }),
        }));
    } else {
      return [];
    }
  }

  // Get error items for video fields
  function parseVideoServerError(error: LEServerError): ServerErrorItem[] {
    /* istanbul ignore else */
    if (Array.isArray(error)) {
      return Object.entries(error[0]).reduce(
        (previous: ServerErrorItem[], [key, e]) => [
          ...previous,
          {
            label: t(`event.form.labelVideo${pascalCase(key)}`),
            message: parseEventServerErrorMessage({ error: e as string[] }),
          },
        ],
        []
      );
    } else {
      return [];
    }
  }

  // Get correct field name for an error item
  function parseEventServerErrorLabel({
    key,
    langText,
  }: {
    key: string;
    langText?: string;
  }): string {
    switch (key) {
      case 'end_time':
      case 'name':
      case 'start_time':
        return t(`event.form.label${pascalCase(key)}.${eventType}`);
      case 'description':
      case 'short_description':
        return t(`event.form.label${pascalCase(key)}.${eventType}`, {
          langText,
        });
      case 'external_links':
        return t(`event.form.titleSocialMedia.${eventType}`);
      case 'offers':
        return t(`event.form.titlePriceInfo.${eventType}`);
      default:
        return t(`event.form.label${pascalCase(key)}`);
    }
  }

  // LE returns always error message in a single language, so use i18n to translate
  // error message to used UI language
  function parseEventServerErrorMessage(error: LEServerError): string {
    let errorStr = '';
    if (Array.isArray(error)) {
      const e =
        typeof error[0] === 'object'
          ? Object.values(error[0]).find((item) => item)
          : error[0];
      errorStr = Array.isArray(e) ? e[0] : e;
    } else {
      const e = Object.values(error).find((item) => item);
      errorStr = Array.isArray(e) ? e[0] : e;
    }

    switch (errorStr) {
      case 'Could not find all objects to update.':
        return t(`event.serverError.notFoundAllObjects`);
      case 'End time cannot be in the past. Please set a future end time.':
        return t(`event.serverError.endTimeInPast`);
      case 'Price info must be specified before an event is published.':
        return t(`event.serverError.offersIsRequired`);
      case 'Short description length must be 160 characters or less':
        return t(`event.serverError.shortDescriptionTooLong`);
      case 'Syötä oikea URL-osoite.':
        return t(`event.serverError.invalidUrl`);
      case 'The name must be specified.':
        return t(`event.serverError.nameIsRequired`);
      case 'This field must be specified before an event is published.':
        return t(`event.serverError.requiredWhenPublishing`);
      case 'Tämä kenttä ei voi olla tyhjä.':
        return t(`event.serverError.required`);
      case 'Tämän luvun on oltava vähintään 0.':
        return t(`event.serverError.min0`);
      default:
        return errorStr;
    }
  }
};
