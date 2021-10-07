import classNames from 'classnames';
import { IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import { ROUTES } from '../../../constants';
import { Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import Container from '../../app/layout/Container';
import { RegistrationsLocationState } from '../../registrations/types';
import { getRegistrationFields } from '../../registrations/utils';
import styles from './buttonPanel.module.scss';

export interface ButtonPanelProps {
  registration: Registration;
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({ registration }) => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const locale = useLocale();
  const history = useHistory<RegistrationsLocationState>();

  const goBack = () => {
    const { id } = getRegistrationFields(registration, locale);
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      search,
      ROUTES.EDIT_REGISTRATION.replace(':id', id)
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: remainingQueryString,
      state: { registrationId: registration.id as string },
    });
  };

  return (
    <div className={styles.buttonPanel}>
      <Container withOffset={true}>
        <div className={styles.buttonsRow}>
          <div className={styles.buttonWrapper}>
            <Button
              className={classNames(styles.backButton, styles.smallButton)}
              iconLeft={<IconArrowLeft />}
              fullWidth={true}
              onClick={goBack}
              type="button"
              variant="secondary"
            >
              {t('enrolmentsPage.buttonBack')}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ButtonPanel;
