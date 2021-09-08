import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { copyRegistrationToSessionStorage } from '../../registration/utils';
import { REGISTRATION_EDIT_ACTIONS } from '../constants';
import {
  addParamsToRegistrationQueryString,
  getEditButtonProps,
  getRegistrationFields,
} from '../utils';
import styles from './actionsDropdown.module.scss';

export interface ActionsDropdownProps {
  className?: string;
  registration: Registration;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, registration }, ref) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const history = useHistory();
    const { pathname, search } = useLocation();
    const { id, registrationUrl } = getRegistrationFields(registration, locale);

    const goToEditRegistrationPage = () => {
      const queryString = addParamsToRegistrationQueryString(search, {
        returnPath: pathname,
      });
      const registrationUrlWithReturnPath = `${registrationUrl}${queryString}`;
      history.push(registrationUrlWithReturnPath);
    };

    const goToRegistrationParticipantsPage = () => {
      const queryString = addParamsToRegistrationQueryString(search, {
        returnPath: pathname,
      });

      history.push({
        pathname: `/${locale}${ROUTES.REGISTRATION_PARTICIPANTS.replace(
          ':registrationId',
          id
        )}`,
        search: queryString,
      });
    };

    const copyRegistration = async () => {
      await copyRegistrationToSessionStorage(registration);
      history.push(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
    };

    const getActionItemProps = ({
      action,
      onClick,
    }: {
      action: REGISTRATION_EDIT_ACTIONS;
      onClick: () => void;
    }): MenuItemOptionProps | null => {
      return getEditButtonProps({
        action,
        onClick,
        t,
      });
    };

    const actionItems: MenuItemOptionProps[] = [
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.EDIT,
        onClick: goToEditRegistrationPage,
      }),
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.SHOW_PARTICIPANTS,
        onClick: goToRegistrationParticipantsPage,
      }),
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.COPY,
        onClick: copyRegistration,
      }),
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.DELETE,
        onClick: () => alert('TODO: Delete registration'),
      }),
    ].filter((i) => i) as MenuItemOptionProps[];

    return (
      <div ref={ref}>
        <MenuDropdown
          button={
            <button className={styles.toggleButton}>
              <IconMenuDots aria-hidden={true} />
            </button>
          }
          buttonLabel={t('registration.form.buttonActions')}
          className={className}
          closeOnItemClick={true}
          fixedPosition={true}
          items={actionItems}
        />
      </div>
    );
  }
);

export default ActionsDropdown;
