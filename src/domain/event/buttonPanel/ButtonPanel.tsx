import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Button from '../../../common/components/button/Button';
import Container from '../../app/layout/Container';
import FormContainer from '../../app/layout/FormContainer';
import { authenticatedSelector } from '../../auth/selectors';
import { EVENT_FIELDS } from '../constants';
import styles from './buttonPanel.module.scss';

interface Props {
  onSaveDraft: () => void;
}

const ButtonPanel: React.FC<Props> = ({ onSaveDraft }) => {
  const { t } = useTranslation();
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const authenticated = useSelector(authenticatedSelector);

  return (
    <div className={styles.buttonPanel}>
      <Container>
        <FormContainer>
          <div className={styles.buttonsRow}>
            <div className={styles.draftButtonColumn}>
              <Button
                disabled={!authenticated}
                fullWidth={true}
                onClick={onSaveDraft}
                title={
                  authenticated ? '' : t('authentication.noRightsCreateEvent')
                }
                type="button"
                variant="secondary"
              >
                {t('event.form.buttonSaveDraft')}
              </Button>
            </div>
            <div className={styles.publishButtonColumn}>
              <Button
                disabled={!authenticated}
                fullWidth={true}
                title={
                  !authenticated ? t('authentication.noRightsPublishEvent') : ''
                }
                type="submit"
              >
                {t(`event.form.buttonPublish.${type}`)}
              </Button>
            </div>
          </div>
        </FormContainer>
      </Container>
    </div>
  );
};

export default ButtonPanel;
