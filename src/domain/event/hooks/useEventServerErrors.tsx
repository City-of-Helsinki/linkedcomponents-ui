/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError, ServerError } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import lowerCaseFirstLetter from '../../../utils/lowerCaseFirstLetter';
import pascalCase from '../../../utils/pascalCase';

type ShowServerErrorsFnParams = {
  callbackFn?: () => void;
  error: any;
  eventType: string;
};

type UseEventServerErrorsState = {
  serverErrorItems: ServerErrorItem[];
  setServerErrorItems: (items: ServerErrorItem[]) => void;
  showServerErrors: (params: ShowServerErrorsFnParams) => void;
};

const useEventServerErrors = (): UseEventServerErrorsState => {
  const { t } = useTranslation();
  const [serverErrorItems, setServerErrorItems] = React.useState<
    ServerErrorItem[]
  >([]);

  const parseEventServerErrors = ({
    eventType,
    result,
  }: {
    eventType: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: Record<string, any> | Record<string, any>[];
  }): ServerErrorItem[] => {
    // Get correct field name for an error item
    const parseEventServerErrorLabel = ({
      key,
      langText,
    }: {
      key: string;
      langText?: string;
    }) => {
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
    };

    // LE returns always error message in a single language, so use i18n to translate
    // error message to used UI language
    const parseEventServerErrorMessage = (error: LEServerError) => {
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
    };

    // LE returns description and short_description fields as localized object.
    // Get error items for each language
    const parseLocalizedServerError = ({
      error,
      key,
    }: {
      error: LEServerError;
      key: string;
    }): ServerErrorItem[] => {
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
    };

    // Get error items for video fields
    const parseVideoServerError = (error: LEServerError): ServerErrorItem[] => {
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
    };

    // Get error item for an single error. Also get all errors for nested fields (description,
    // short_description, videos)
    const parseEventServerError = ({
      error,
      key,
    }: {
      error: LEServerError;
      key: string;
    }): ServerErrorItem[] => {
      switch (key) {
        case 'description':
        case 'short_description':
          return parseLocalizedServerError({ error, key });
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
    };

    // LE returns errors as array when trying to create/edit multiple events in same request.
    // In that case call parseEventServerErrors recursively to get all single errors
    return Array.isArray(result)
      ? result.reduce(
          (previous: ServerErrorItem[], r) => [
            ...previous,
            ...parseEventServerErrors({ eventType, result: r }),
          ],
          []
        )
      : Object.entries(result).reduce(
          (previous: ServerErrorItem[], [key, error]) => [
            ...previous,
            ...parseEventServerError({ error, key }),
          ],
          []
        );
  };

  const showServerErrors = ({
    callbackFn,
    error,
    eventType,
  }: ShowServerErrorsFnParams) => {
    /* istanbul ignore else */
    if (error instanceof ApolloError) {
      const { networkError } = error;
      const { result } = networkError as ServerError;

      /* istanbul ignore else */
      if (result) {
        setServerErrorItems(parseEventServerErrors({ eventType, result }));
        callbackFn && callbackFn();
      }
    }
  };

  return { serverErrorItems, setServerErrorItems, showServerErrors };
};

export default useEventServerErrors;
