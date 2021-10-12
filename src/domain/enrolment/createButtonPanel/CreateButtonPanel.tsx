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
import { EnrolmentsLocationState } from '../../enrolments/types';
import FormContainer from '../formContainer/FormContainer';
import styles from './createButtonPanel.module.scss';

interface Props {
  onSave: () => void;
  registration: Registration;
}

const CreateButtonPanel: React.FC<Props> = ({ onSave, registration }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const history = useHistory<EnrolmentsLocationState>();
  const { search } = useLocation();

  const goBack = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      search,
      ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
        ':registrationId',
        registration.id as string
      )
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: remainingQueryString,
    });
  };

  return (
    <div className={styles.createButtonPanel}>
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

export default CreateButtonPanel;
