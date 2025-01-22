import { TFunction } from 'i18next';

import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import {
  Language,
  LEServerError,
  OptionType,
  ServerErrorItem,
} from '../../../types';
import isGenericServerError from '../../../utils/isGenericServerError';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import parseServerErrorArray from '../../../utils/parseServerErrorArray';
import parseServerErrorLabel from '../../../utils/parseServerErrorLabel';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import { parseServerErrors } from '../../../utils/parseServerErrors';
import pascalCase from '../../../utils/pascalCase';
import skipFalsyType from '../../../utils/skipFalsyType';
import { EVENT_ACTIONS } from '../constants';

export const getEventCreateAction = (
  publicationStatus: PublicationStatus
): EVENT_ACTIONS => {
  switch (publicationStatus) {
    case PublicationStatus.Draft:
      return EVENT_ACTIONS.CREATE_DRAFT;
    case PublicationStatus.Public:
      return EVENT_ACTIONS.PUBLISH;
  }
};

export const getEventUpdateAction = (
  event: EventFieldsFragment,
  publicationStatus: PublicationStatus
): EVENT_ACTIONS => {
  if (event.publicationStatus === PublicationStatus.Draft) {
    return publicationStatus === PublicationStatus.Draft
      ? EVENT_ACTIONS.UPDATE_DRAFT
      : EVENT_ACTIONS.ACCEPT_AND_PUBLISH;
  }
  return EVENT_ACTIONS.UPDATE_PUBLIC;
};

export const sortAudienceOptions =
  (locale: Language) =>
  (a: OptionType, b: OptionType): number =>
    a.label.localeCompare(b.label, locale);

export const parseEventServerErrors = ({
  eventType,
  result,
  t,
}: {
  eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseEventServerError,
    result,
    t,
  });

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
      case 'offers':
        return parseOffersServerError({ error, key });
      case 'videos':
        return parseServerErrorArray({
          error,
          parseLabelFn: parseVideoServerErrorLabel,
          t,
        });
      default:
        return [
          {
            label: parseEventServerErrorLabel({ key }),
            message: parseServerErrorMessage({ error, t }),
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
            message: parseServerErrorMessage({ error: [e as string], t }),
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
      return error.filter(skipFalsyType).map((e) => ({
        label: parseEventServerErrorLabel({ key }),
        message: parseServerErrorMessage({
          error:
            /* istanbul ignore next */
            typeof e === 'string' ? e : (e.link as string[]),
          t,
        }),
      }));
    } else {
      return [];
    }
  }

  function parseOfferPriceGroupServerErrorLabel({
    key,
  }: {
    key: string;
  }): string {
    return t(
      `registration.form.registrationPriceGroup.label${pascalCase(key)}`
    );
  }

  function parseOffersServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }): ServerErrorItem[] {
    if (key === 'offer_price_groups') {
      return parseServerErrorArray({
        error,
        parseLabelFn: parseOfferPriceGroupServerErrorLabel,
        t,
      });
    }

    if (Array.isArray(error)) {
      return error.reduce((prev, curr) => {
        return [...prev, ...parseOffersServerError({ error: curr, key })];
      }, [] as ServerErrorItem[]);
    } else if (typeof error === 'object') {
      return Object.entries(error).reduce(
        (previous: ServerErrorItem[], [k, e]) => [
          ...previous,
          ...parseOffersServerError({ error: e as LEServerError, key: k }),
        ],
        []
      );
    }

    return [
      {
        label: parseServerErrorLabel({
          key,
          parseFn: () => t(`event.form.titlePriceInfo.${eventType}`),
        }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get error items for video fields
  function parseVideoServerErrorLabel({ key }: { key: string }): string {
    return t(`event.form.labelVideo${pascalCase(key)}`);
  }

  // Get correct field name for an error item
  function parseEventServerErrorLabel({
    key,
    langText,
  }: {
    key: string;
    langText?: string;
  }): string {
    if (isGenericServerError(key)) {
      return '';
    }

    switch (key) {
      case 'end_time':
      case 'start_time':
        return t(
          `event.form.label${pascalCase(
            key.replace('time', 'date')
          )}.${eventType}`
        );
      case 'name':
        return t(`event.form.label${pascalCase(key)}.${eventType}`, {
          langText: lowerCaseFirstLetter(t(`form.inLanguage.fi`)),
        });
      case 'description':
      case 'short_description':
        return t(`event.form.label${pascalCase(key)}.${eventType}`, {
          langText,
        });
      case 'external_links':
        return t(`event.form.titleSocialMedia.${eventType}`);
      default:
        return t(`event.form.label${pascalCase(key)}`);
    }
  }
};
