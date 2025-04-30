import { IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import ErrorTemplate from '../../../common/components/errorTemplate/ErrorTemplate';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import getValue from '../../../utils/getValue';
import MainContent from '../../app/layout/mainContent/MainContent';
import PageWrapper from '../../app/layout/pageWrapper/PageWrapper';
import styles from '../signupGroupPage.module.scss';

type Props = {
  registration: RegistrationFieldsFragment;
};

const SignupIsEnded: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();

  const goBack = useGoBack({
    defaultReturnPath: ROUTES.REGISTRATION_SIGNUPS.replace(
      ':registrationId',
      getValue(registration.id, '')
    ),
  });

  return (
    <PageWrapper
      className={styles.createContainer}
      title={`createSignupGroupPage.pageTitle`}
    >
      <MainContent>
        <ErrorTemplate
          buttons={
            <Button
              fullWidth={true}
              iconLeft={<IconArrowLeft aria-hidden />}
              onClick={goBack}
              type="button"
              variant="primary"
            >
              {t('common.buttonBack')}
            </Button>
          }
          text={t('signup.signupIsEnded')}
        />
      </MainContent>
    </PageWrapper>
  );
};

export default SignupIsEnded;
