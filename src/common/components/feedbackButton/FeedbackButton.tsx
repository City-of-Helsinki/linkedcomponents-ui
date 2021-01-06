import { IconAngleRight, IconSpeechbubbleText } from 'hds-react';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../button/Button';
import styles from './feedbackButton.module.scss';

interface Props {
  color?: 'black' | 'default';
}

const FeedbackButton: React.FC<Props> = ({ color = 'default' }) => {
  const { t } = useTranslation();

  const goToFeedback = () => {
    window.open(t('common.feedback.url'), '_self');
  };

  return (
    <Button
      className={styles[`color${capitalize(color)}`]}
      iconLeft={<IconSpeechbubbleText />}
      iconRight={<IconAngleRight />}
      onClick={goToFeedback}
      variant="supplementary"
    >
      {t('common.feedback.text')}
    </Button>
  );
};

export default FeedbackButton;
