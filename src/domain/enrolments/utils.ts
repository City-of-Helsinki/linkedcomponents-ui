import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';
import { scroller } from 'react-scroll';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../constants';
import {
  EnrolmentFieldsFragment,
  EnrolmentsQueryVariables,
  RegistrationFieldsFragment,
} from '../../generated/graphql';
import { Language, PathBuilderProps } from '../../types';
import getPageHeaderHeight from '../../utils/getPageHeaderHeight';
import queryBuilder from '../../utils/queryBuilder';
import setFocusToFirstFocusable from '../../utils/setFocusToFirstFocusable';
import { REGISTRATION_SEARCH_PARAMS } from '../registrations/constants';
import {
  AUTHENTICATION_NOT_NEEDED,
  ENROLMENT_EDIT_ACTIONS,
  ENROLMENT_EDIT_ICONS,
  ENROLMENT_EDIT_LABEL_KEYS,
} from './constants';
import { EnrolmentFields, EnrolmentSearchInitialValues } from './types';

export const getEnrolmentSearchInitialValues = (
  search: string
): EnrolmentSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(REGISTRATION_SEARCH_PARAMS.ENROLMENT_PAGE);
  const text = searchParams.get(REGISTRATION_SEARCH_PARAMS.ENROLMENT_TEXT);

  return {
    enrolmentPage: Number(page) || 1,
    enrolmentText: text || '',
  };
};

export const getEnrolmentFields = ({
  enrolment,
  language,
  registration,
}: {
  enrolment: EnrolmentFieldsFragment;
  language: Language;
  registration: RegistrationFieldsFragment;
}): EnrolmentFields => {
  const id = enrolment.id || '';
  /* istanbul ignore next */
  const registrationId = registration.id || '';

  return {
    id,
    email: enrolment.email ?? '',
    enrolmentUrl: `/${language}${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
      ':registrationId',
      registrationId
    ).replace(':enrolmentId', id)}`,
    name: enrolment.name ?? '',
    phoneNumber: enrolment.phoneNumber ?? '',
  };
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
    case ENROLMENT_EDIT_ACTIONS.UPDATE:
      return true;
  }
};

export const getEditEnrolmentWarning = ({
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
    return t('enrolmentsPage.warningNoRightsToEdit');
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
  enrolment: EnrolmentFieldsFragment;
  t: TFunction;
}): EnrolmentEditability => {
  const userCanDoAction = checkCanUserDoAction({ action });

  const warning = getEditEnrolmentWarning({
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
  enrolment: EnrolmentFieldsFragment;
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

export const getEnrolmentItemId = (id: string): string =>
  `enrolment-item-${id}`;

export const scrollToEnrolmentItem = (id: string): void => {
  const offset = 24;
  const duration = 300;

  scroller.scrollTo(id, {
    delay: 50,
    duration: 300,
    offset: 0 - (getPageHeaderHeight() + offset),
    smooth: true,
  });

  setTimeout(() => setFocusToFirstFocusable(id), duration);
};

export const clearEnrolmentsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'enrolments' });

export const enrolmentsPathBuilder = ({
  args,
}: PathBuilderProps<EnrolmentsQueryVariables>): string => {
  const { page, pageSize, registration, text } = args;

  const variableToKeyItems = [
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'registration', value: registration },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/enrolment/${query}`;
};
