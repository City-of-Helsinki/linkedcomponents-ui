import { ButtonProps, IconAngleRight, IconSpeechbubbleText } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../button/Button';

const FeedbackButton: React.FC<Omit<ButtonProps, 'children'>> = (props) => {
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
      {...props}
    >
      {t('common.feedback.text')}
    </Button>
  );
};

export default FeedbackButton;
