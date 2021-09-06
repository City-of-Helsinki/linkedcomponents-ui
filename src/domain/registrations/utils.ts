import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../constants';
import { Registration } from '../../generated/graphql';
import { Language } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import { getSearchQuery } from '../../utils/searchUtils';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { EVENT_TYPE } from '../event/constants';
import {
  DEFAULT_REGISTRATION_SORT,
  REGISTRATION_EDIT_ACTIONS,
  REGISTRATION_EDIT_ICONS,
  REGISTRATION_EDIT_LABEL_KEYS,
  REGISTRATION_SEARCH_PARAMS,
  REGISTRATION_SORT_OPTIONS,
} from './constants';
import {
  RegistrationFields,
  RegistrationSearchInitialValues,
  RegistrationSearchParam,
  RegistrationSearchParams,
} from './types';

export const getRegistrationSearchInitialValues = (
  search: string
): RegistrationSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const eventType = searchParams.getAll(
    REGISTRATION_SEARCH_PARAMS.EVENT_TYPE
  ) as EVENT_TYPE[];
  const page = searchParams.get(REGISTRATION_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(
    REGISTRATION_SEARCH_PARAMS.SORT
  ) as REGISTRATION_SORT_OPTIONS;
  const text = searchParams.get(REGISTRATION_SEARCH_PARAMS.TEXT);

  return {
    eventType,
    page: Number(page) || 1,
    sort: Object.values(REGISTRATION_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_REGISTRATION_SORT,
    text: text || '',
  };
};

export const getRegistrationSearchQuery = (
  params: Omit<RegistrationSearchParams, 'sort'>,
  search = ''
): string => {
  const { sort } = getRegistrationSearchInitialValues(search);

  return getSearchQuery({
    ...params,
    sort: sort !== DEFAULT_REGISTRATION_SORT ? sort : null,
  });
};

export const getRegistrationParamValue = ({
  param,
  value,
}: {
  param: RegistrationSearchParam;
  value: string;
}): string => {
  switch (param) {
    case REGISTRATION_SEARCH_PARAMS.EVENT_TYPE:
    case REGISTRATION_SEARCH_PARAMS.PAGE:
    case REGISTRATION_SEARCH_PARAMS.SORT:
    case REGISTRATION_SEARCH_PARAMS.TEXT:
      return value;
    case REGISTRATION_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown registration query parameter');
  }
};

export const addParamsToRegistrationQueryString = (
  queryString: string,
  queryParams: Partial<RegistrationSearchParams>
): string => {
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as RegistrationSearchParam;
    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getRegistrationParamValue({ param, value }))
      );
    } /* istanbul ignore else */ else if (values) {
      searchParams.append(
        param,
        getRegistrationParamValue({ param, value: values.toString() })
      );
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

export const replaceParamsToRegistrationQueryString = (
  queryString: string,
  queryParams: Partial<RegistrationSearchParams>
): string => {
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as RegistrationSearchParam;
    searchParams.delete(param);

    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getRegistrationParamValue({ param, value }))
      );
    } else if (values) {
      searchParams.append(
        param,
        getRegistrationParamValue({ param, value: values.toString() })
      );
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

export const getRegistrationFields = (
  registration: Registration,
  language: Language
): RegistrationFields => {
  const id = registration.id || '';

  return {
    id,
    atId: registration.atId || '',
    currentAttendeeCount: registration.currentAttendeeCount ?? 0,
    currentWaitingAttendeeCapacity:
      registration.currentWaitingAttendeeCapacity ?? 0,
    enrolmentEndTime: registration.enrolmentEndTime
      ? new Date(registration.enrolmentEndTime)
      : null,
    enrolmentStartTime: registration.enrolmentStartTime
      ? new Date(registration.enrolmentStartTime)
      : null,
    maximumAttendeeCount: registration.maximumAttendeeCount ?? 0,
    name: getLocalisedString(registration.name, language),
    publisher: registration.publisher || null,
    registrationUrl: `/${language}${ROUTES.EDIT_REGISTRATION.replace(
      ':id',
      id
    )}`,
    waitingAttendeeCapacity: registration.waitingAttendeeCapacity ?? 0,
  };
};

export const getEditButtonProps = ({
  action,
  onClick,
  t,
}: {
  action: REGISTRATION_EDIT_ACTIONS;
  onClick: () => void;
  t: TFunction;
}): MenuItemOptionProps | null => {
  return {
    disabled: false,
    icon: REGISTRATION_EDIT_ICONS[action],
    label: t(REGISTRATION_EDIT_LABEL_KEYS[action]),
    onClick,
    title: '',
  };
};
