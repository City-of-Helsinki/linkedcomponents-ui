import { IconCheck, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Button from '../../../common/components/button/Button';
import { PAGE_HEADER_ID } from '../../../constants';
import useWindowSize from '../../../hooks/useWindowSize';
import Container from '../../app/layout/Container';
import { authenticatedSelector } from '../../auth/selectors';
import styles from './editButtonPanel.module.scss';

interface Props {
  onSaveDraft: () => void;
}

const getTop = (): number => {
  const pageHeader = document.getElementById(PAGE_HEADER_ID);
  return pageHeader?.clientHeight ? pageHeader.clientHeight - 2 : 0;
};

const EditButtonPanel: React.FC<Props> = ({ onSaveDraft }) => {
  const [top, setTop] = React.useState(getTop());
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const windowSize = useWindowSize();

  React.useEffect(() => {
    setTop(getTop());
  }, [windowSize]);

  return (
    <div className={styles.editButtonPanel} style={{ top }}>
      <Container>
        <div className={styles.buttonsRow}>
          <div className={styles.backButtonWrapper}></div>
          <div className={styles.actionButtonWrapper}></div>
          <div className={styles.saveButtonWrapper}>
            <Button
              disabled={!authenticated}
              iconLeft={<IconPen />}
              onClick={onSaveDraft}
              title={
                authenticated ? '' : t('authentication.noRightsCreateEvent')
              }
              type="button"
              variant="primary"
            >
              {t('event.form.buttonSaveDraft')}
            </Button>
            <Button
              disabled={!authenticated}
              iconLeft={<IconCheck />}
              title={
                authenticated ? '' : t('authentication.noRightsPublishEvent')
              }
              type="submit"
            >
              {t(`event.form.buttonAcceptAndPublish`)}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EditButtonPanel;
