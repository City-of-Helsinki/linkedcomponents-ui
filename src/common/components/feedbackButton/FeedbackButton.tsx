import classNames from 'classnames';
import {
  ButtonProps,
  ButtonVariant,
  IconAngleRight,
  IconSpeechbubbleText,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Button from '../button/Button';
import styles from './feedbackButton.module.scss';

const FeedbackButton: React.FC<Omit<ButtonProps, 'children'>> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const goToFeedback = () => {
    navigate(`/${locale}${ROUTES.SUPPORT_CONTACT}`);
  };

  return (
    <Button
      {...props}
      iconStart={<IconSpeechbubbleText />}
      iconEnd={<IconAngleRight />}
      onClick={goToFeedback}
      variant={ButtonVariant.Supplementary}
      className={classNames(props.className, styles.feedbackButton)}
    >
      {t('common.feedback.text')}
    </Button>
  );
};

export default FeedbackButton;
