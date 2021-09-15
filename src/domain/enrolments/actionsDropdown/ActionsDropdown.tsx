import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { Enrolment, Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { authenticatedSelector } from '../../auth/selectors';
import { getRegistrationFields } from '../../registrations/utils';
import { ENROLMENT_EDIT_ACTIONS } from '../constants';
import {
  addParamsToEnrolmentQueryString,
  getEditButtonProps,
  getEnrolmentFields,
} from '../utils';
import styles from './actionsDropdown.module.scss';

export interface ActionsDropdownProps {
  className?: string;
  enrolment: Enrolment;
  registration: Registration;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, enrolment, registration }, ref) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const history = useHistory();
    const authenticated = useSelector(authenticatedSelector);
    const { pathname, search } = useLocation();
    const { id: registrationId } = getRegistrationFields(registration, locale);
    const { id } = getEnrolmentFields({
      enrolment,
      language: locale,
      registration,
    });

    const goToEditEnrolmentPage = () => {
      const queryString = addParamsToEnrolmentQueryString(search, {
        returnPath: pathname,
      });

      history.push({
        pathname: `/${locale}${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
          ':registrationId',
          registrationId
        ).replace('enrolmentId', id)}`,
        search: queryString,
      });
    };

    const getActionItemProps = ({
      action,
      onClick,
    }: {
      action: ENROLMENT_EDIT_ACTIONS;
      onClick: () => void;
    }): MenuItemOptionProps | null => {
      return getEditButtonProps({
        action,
        authenticated,
        enrolment,
        onClick,
        t,
      });
    };

    const actionItems: MenuItemOptionProps[] = [
      getActionItemProps({
        action: ENROLMENT_EDIT_ACTIONS.EDIT,
        onClick: goToEditEnrolmentPage,
      }),
      getActionItemProps({
        action: ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE,
        onClick: () => alert('TODO: Send message to attendee'),
      }),
      getActionItemProps({
        action: ENROLMENT_EDIT_ACTIONS.CANCEL,
        onClick: () => alert('TODO: Cancel enrolment'),
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
          buttonLabel={t('enrolments.buttonActions')}
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
