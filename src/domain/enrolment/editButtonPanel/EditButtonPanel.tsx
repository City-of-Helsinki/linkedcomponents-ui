import classNames from 'classnames';
import { IconArrowLeft, IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';

import Button from '../../../common/components/button/Button';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { Enrolment, Registration } from '../../../generated/graphql';
import useIsMobile from '../../../hooks/useIsMobile';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import skipFalsyType from '../../../utils/skipFalsyType';
import Container from '../../app/layout/Container';
import { authenticatedSelector } from '../../auth/selectors';
import { ENROLMENT_EDIT_ACTIONS } from '../../enrolments/constants';
import { EnrolmentsLocationState } from '../../enrolments/types';
import { getEditButtonProps } from '../../enrolments/utils';
import FormContainer from '../formContainer/FormContainer';
import styles from './editButtonPanel.module.scss';

export interface EditButtonPanelProps {
  enrolment: Enrolment;
  onSave: () => void;
  registration: Registration;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  enrolment,
  onSave,
  registration,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const isMobile = useIsMobile();
  const history = useHistory<EnrolmentsLocationState>();
  const { search } = useLocation();

  const goBack = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      search,
      ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registration.id as string
      )
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: remainingQueryString,
      state: { enrolmentId: enrolment.id },
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
      action: ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE,
      onClick: () => toast.error('TODO: Send message to attendee'),
    }),
    getActionItemProps({
      action: ENROLMENT_EDIT_ACTIONS.CANCEL,
      onClick: () => toast.error('TODO: Cancel enrolment'),
    }),
  ].filter(skipFalsyType);

  return (
    <div className={styles.editButtonPanel}>
      <Container withOffset={true}>
        <FormContainer>
          <div className={styles.buttonsRow}>
            <div className={styles.buttonWrapper}>
              <Button
                className={classNames(styles.backButton, styles.smallButton)}
                iconLeft={<IconArrowLeft aria-hidden />}
                fullWidth={true}
                onClick={goBack}
                type="button"
                variant="secondary"
              >
                {t('common.buttonBack')}
              </Button>
              <div className={styles.actionsDropdown}>
                <MenuDropdown
                  button={
                    isMobile ? (
                      <button className={styles.toggleButton}>
                        <IconMenuDots aria-hidden={true} />
                      </button>
                    ) : undefined
                  }
                  buttonLabel={t('common.buttonActions')}
                  closeOnItemClick={true}
                  items={actionItems}
                  menuPosition="top"
                />
              </div>
            </div>
            <div className={styles.buttonColumn}>
              <Button
                className={styles.button}
                fullWidth={true}
                onClick={onSave}
                type="button"
              >
                {t('enrolment.form.buttonSave')}
              </Button>
            </div>
          </div>
        </FormContainer>
      </Container>
    </div>
  );
};

export default EditButtonPanel;
