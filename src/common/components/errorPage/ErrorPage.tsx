import { ClassNames } from '@emotion/react';
import { IconAlertCircle, IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { ROUTES } from '../../../constants';
import Container from '../../../domain/app/layout/container/Container';
import MainContent from '../../../domain/app/layout/mainContent/MainContent';
import { useTheme } from '../../../domain/app/theme/Theme';
import { useAuth } from '../../../domain/auth/hooks/useAuth';
import useLocale from '../../../hooks/useLocale';
import Button from '../button/Button';
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
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const goToHome = () => {
    navigate(`/${locale}${ROUTES.HOME}`);
  };

  const handleSignIn = () => {
    signIn(signInPath);
  };

  return (
    <ClassNames>
      {({ css }) => (
        <MainContent>
          <Container
            className={css(theme.errorPage)}
            contentWrapperClassName={styles.errorPage}
          >
            <div className={styles.content}>
              <IconAlertCircle className={styles.icon} />
              <p>{text}</p>
              <div className={styles.buttonsWrapper}>
                <div className={styles.buttons}>
                  <Button
                    fullWidth={true}
                    iconLeft={<IconArrowLeft aria-hidden />}
                    onClick={goToHome}
                    type="button"
                    variant="secondary"
                  >
                    {homePageButtonText || t('common.goToHome')}
                  </Button>
                  <Button
                    fullWidth={true}
                    onClick={handleSignIn}
                    type="button"
                    variant="primary"
                  >
                    {t('common.signIn')}
                  </Button>
                </div>
              </div>
              <FeedbackButton />
            </div>
          </Container>
        </MainContent>
      )}
    </ClassNames>
  );
};

export default ErrorPage;
