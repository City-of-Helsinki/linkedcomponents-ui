/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { KeywordSetFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { addParamsToAdminListQueryString } from '../../../utils/adminListQueryStringUtils';
import skipFalsyType from '../../../utils/skipFalsyType';
import useAuth from '../../auth/hooks/useAuth';
import { KEYWORD_SET_ACTIONS } from '../../keywordSet/constants';
import {
  getEditButtonProps,
  getKeywordSetFields,
} from '../../keywordSet/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';

export interface KeywordSetActionsDropdownProps {
  className?: string;
  keywordSet: KeywordSetFieldsFragment;
}

const KeywordSetActionsDropdown: React.FC<KeywordSetActionsDropdownProps> = ({
  className,
  keywordSet,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { id, organization } = getKeywordSetFields(keywordSet, locale);
  const { organizationAncestors } = useOrganizationAncestors(organization);

  const { pathname, search } = useLocation();

  const goToEditKeywordSetPage = () => {
    const queryString = addParamsToAdminListQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`,
      search: queryString,
    });
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: KEYWORD_SET_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEditButtonProps({
      action,
      authenticated,
      onClick,
      organization,
      organizationAncestors,
      t,
      user,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: KEYWORD_SET_ACTIONS.EDIT,
      onClick: goToEditKeywordSetPage,
    }),
  ].filter(skipFalsyType);

  return <ActionsDropdown className={className} items={actionItems} />;
};

export default KeywordSetActionsDropdown;
