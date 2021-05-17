import classNames from 'classnames';
import { ButtonProps, IconAngleRight, IconSpeechbubbleText } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Button from '../button/Button';
import styles from './feedbackButton.module.scss';

const FeedbackButton: React.FC<Omit<ButtonProps, 'children'>> = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();

  const goToFeedback = () => {
    history.push(`/${locale}${ROUTES.SUPPORT_CONTACT}`);
  };

  return (
    <Button
      {...props}
      iconLeft={<IconSpeechbubbleText />}
      iconRight={<IconAngleRight />}
      onClick={goToFeedback}
      variant="supplementary"
      className={classNames(props.className, styles.feedbackButton)}
    >
      {t('common.feedback.text')}
    </Button>
  );
};

export default FeedbackButton;
