import { ClassNames } from '@emotion/react';
import { ButtonVariant, IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { ROUTES } from '../../../constants';
import MainContent from '../../../domain/app/layout/mainContent/MainContent';
import useAuth from '../../../domain/auth/hooks/useAuth';
import useLocale from '../../../hooks/useLocale';
import Button from '../button/Button';
import ErrorTemplate from '../errorTemplate/ErrorTemplate';
import FeedbackButton from '../feedbackButton/FeedbackButton';
import styles from './errorPage.module.scss';

interface Props {
  homePageButtonText?: string | null;
  signInPath: string;
  text: string;
}

const ErrorPage: React.FC<Props> = ({
  homePageButtonText,
  signInPath,
  text,
}) => {
  const locale = useLocale();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const goToHome = () => {
    navigate(`/${locale}${ROUTES.HOME}`);
  };

  const handleSignIn = () => {
    login(signInPath);
  };

  return (
    <ClassNames>
      {({ css }) => (
        <MainContent>
          <ErrorTemplate
            buttons={
              <div className={styles.buttons}>
                <Button
                  fullWidth={true}
                  iconStart={<IconArrowLeft aria-hidden />}
                  onClick={goToHome}
                  type="button"
                  variant={ButtonVariant.Secondary}
                >
                  {homePageButtonText || t('common.goToHome')}
                </Button>
                <Button
                  fullWidth={true}
                  onClick={handleSignIn}
                  type="button"
                  variant={ButtonVariant.Primary}
                >
                  {t('common.signIn')}
                </Button>
              </div>
            }
            text={text}
          >
            <FeedbackButton />
          </ErrorTemplate>
        </MainContent>
      )}
    </ClassNames>
  );
};

export default ErrorPage;
