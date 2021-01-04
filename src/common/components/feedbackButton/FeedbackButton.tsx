import { IconAngleRight, IconSpeechbubbleText } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../button/Button';

const FeedbackButton = () => {
  const { t } = useTranslation();

  const goToFeedback = () => {
    window.open(t('common.feedback.url'), '_self');
  };

  return (
    <Button
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
