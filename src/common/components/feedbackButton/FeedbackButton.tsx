import classNames from 'classnames';
import { ButtonProps, IconAngleRight, IconSpeechbubbleText } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../button/Button';
import styles from './feedbackButton.module.scss';

const FeedbackButton: React.FC<Omit<ButtonProps, 'children'>> = (props) => {
  const { t } = useTranslation();

  const goToFeedback = () => {
    window.open(t('common.feedback.url'), '_self');
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
