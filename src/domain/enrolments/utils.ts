import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../constants';
import { Enrolment, Registration } from '../../generated/graphql';
import { Language } from '../../types';
import { getSearchQuery } from '../../utils/searchUtils';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import {
  AUTHENTICATION_NOT_NEEDED,
  ENROLMENT_EDIT_ACTIONS,
  ENROLMENT_EDIT_ICONS,
  ENROLMENT_EDIT_LABEL_KEYS,
  ENROLMENT_SEARCH_PARAMS,
} from './constants';
import {
  EnrolmentFields,
  EnrolmentSearchInitialValues,
  EnrolmentSearchParam,
  EnrolmentSearchParams,
} from './types';

export const getEnrolmentSearchQuery = (
  params: Omit<EnrolmentSearchParams, 'sort'>
): string => {
  return getSearchQuery(params);
};

export const getEnrolmentSearchInitialValues = (
  search: string
): EnrolmentSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(ENROLMENT_SEARCH_PARAMS.PAGE);
  const text = searchParams.get(ENROLMENT_SEARCH_PARAMS.TEXT);

  return {
    page: Number(page) || 1,
    text: text || '',
  };
};

export const getEnrolmentParamValue = ({
  param,
  value,
}: {
  param: EnrolmentSearchParam;
  value: string;
}): string => {
  switch (param) {
    case ENROLMENT_SEARCH_PARAMS.PAGE:
    case ENROLMENT_SEARCH_PARAMS.TEXT:
      return value;
    case ENROLMENT_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown enrolment query parameter');
  }
};

export const replaceParamsToEnrolmentQueryString = (
  queryString: string,
  queryParams: Partial<EnrolmentSearchParams>
): string => {
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as EnrolmentSearchParam;
    searchParams.delete(param);

    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getEnrolmentParamValue({ param, value }))
      );
    } else if (values) {
      searchParams.append(
        param,
        getEnrolmentParamValue({ param, value: values.toString() })
      );
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

export const getEnrolmentFields = ({
  enrolment,
  language,
  registration,
}: {
  enrolment: Enrolment;
  language: Language;
  registration: Registration;
}): EnrolmentFields => {
  const id = enrolment.id || '';

  return {
    id,
    email: enrolment.email ?? '',
    enrolmentUrl: `/${language}${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
      ':registrationId',
      registration.id ?? ''
    ).replace(':enrolmentId', id)}`,
    name: enrolment.name ?? '',
    phoneNumber: enrolment.phoneNumber ?? '',
  };
};

export const addParamsToEnrolmentQueryString = (
  queryString: string,
  queryParams: Partial<EnrolmentSearchParams>
): string => {
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as EnrolmentSearchParam;
    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getEnrolmentParamValue({ param, value }))
      );
    } /* istanbul ignore else */ else if (values) {
      searchParams.append(
        param,
        getEnrolmentParamValue({ param, value: values.toString() })
      );
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

type EnrolmentEditability = {
  editable: boolean;
  warning: string;
};

// TODO: Check also user organizations when API is available e.g. similar funtion in events
export const checkCanUserDoAction = ({
  action,
}: {
  action: ENROLMENT_EDIT_ACTIONS;
}): boolean => {
  switch (action) {
    case ENROLMENT_EDIT_ACTIONS.CANCEL:
    case ENROLMENT_EDIT_ACTIONS.EDIT:
    case ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE:
      return true;
  }
};

export const getEditRegistrationWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: ENROLMENT_EDIT_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateEnrolment');
  }

  if (!userCanDoAction) {
    return t('enrolments.warningNoRightsToEdit');
  }

  return '';
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  enrolment,
  t,
}: {
  action: ENROLMENT_EDIT_ACTIONS;
  authenticated: boolean;
  enrolment: Enrolment;
  t: TFunction;
}): EnrolmentEditability => {
  const userCanDoAction = checkCanUserDoAction({ action });

  const warning = getEditRegistrationWarning({
    action,
    authenticated,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getEditButtonProps = ({
  action,
  authenticated,
  enrolment,
  onClick,
  t,
}: {
  action: ENROLMENT_EDIT_ACTIONS;
  authenticated: boolean;
  enrolment: Enrolment;
  onClick: () => void;
  t: TFunction;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    enrolment,
    t,
  });

  return {
    disabled: !editable,
    icon: ENROLMENT_EDIT_ICONS[action],
    label: t(ENROLMENT_EDIT_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};
