import {
  IconArrowLeft,
  IconCalendarClock,
  IconCheck,
  IconPen,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Button from '../../../common/components/button/Button';
import { PAGE_HEADER_ID, ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useWindowSize from '../../../hooks/useWindowSize';
import Container from '../../app/layout/Container';
import { authenticatedSelector } from '../../auth/selectors';
import { getEventFields } from '../utils';
import styles from './editButtonPanel.module.scss';

export enum BUTTONS {
  POSTPONE = 'postpone',
  PUBLISH = 'publish',
  UPDATE_DRAFT = 'updateDraft',
  UPDATE_PUBLIC = 'updatePublic',
}

interface Props {
  event: EventFieldsFragment;
  onPostpone: () => void;
  onUpdate: (publicationStatus: PublicationStatus) => void;
}

const getTop = (): number => {
  const pageHeader = document.getElementById(PAGE_HEADER_ID);
  return pageHeader?.clientHeight ? pageHeader.clientHeight - 2 : 0;
};

const EditButtonPanel: React.FC<Props> = ({ event, onPostpone, onUpdate }) => {
  const [top, setTop] = React.useState(getTop());
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory();
  const windowSize = useWindowSize();
  const { publicationStatus } = getEventFields(event, locale);
  const isDraft = publicationStatus === PublicationStatus.Draft;
  const isPublic = publicationStatus === PublicationStatus.Public;

  const getIsButtonVisible = (button: BUTTONS) => {
    switch (button) {
      case BUTTONS.POSTPONE:
        return isPublic;
      case BUTTONS.PUBLISH:
        return isDraft;
      case BUTTONS.UPDATE_DRAFT:
        return isDraft;
      case BUTTONS.UPDATE_PUBLIC:
        return isPublic;
    }
  };

  const goToEventsPage = () => {
    history.push(`/${locale}${ROUTES.EVENTS}`);
  };

  React.useEffect(() => {
    setTop(getTop());
  }, [windowSize]);

  return (
    <div className={styles.editButtonPanel} style={{ top }}>
      <Container>
        <div className={styles.buttonsRow}>
          <div className={styles.backButtonWrapper}>
            <Button
              className={styles.backButton}
              iconLeft={<IconArrowLeft />}
              fullWidth={true}
              onClick={goToEventsPage}
              type="button"
              variant="supplementary"
            >
              {t('event.form.buttonBack')}
            </Button>
          </div>
          <div className={styles.actionButtonWrapper}>
            {getIsButtonVisible(BUTTONS.POSTPONE) && (
              <Button
                disabled={!authenticated}
                iconLeft={<IconCalendarClock />}
                onClick={() => onPostpone()}
                title={
                  authenticated ? '' : t('authentication.noRightsCreateEvent')
                }
                type="button"
              >
                {t('event.form.buttonPostpone')}
              </Button>
            )}
          </div>
          <div className={styles.saveButtonWrapper}>
            {/* Buttons for draft event */}
            {getIsButtonVisible(BUTTONS.UPDATE_DRAFT) && (
              <Button
                disabled={!authenticated}
                iconLeft={<IconPen />}
                onClick={() => onUpdate(PublicationStatus.Draft)}
                title={
                  authenticated ? '' : t('authentication.noRightsCreateEvent')
                }
                type="button"
              >
                {t('event.form.buttonUpdateDraft')}
              </Button>
            )}
            {getIsButtonVisible(BUTTONS.PUBLISH) && (
              <Button
                disabled={!authenticated}
                iconLeft={<IconCheck />}
                onClick={() => onUpdate(PublicationStatus.Public)}
                title={
                  authenticated ? '' : t('authentication.noRightsPublishEvent')
                }
                type="button"
              >
                {t(`event.form.buttonAcceptAndPublish`)}
              </Button>
            )}

            {/* Buttons for public event */}
            {getIsButtonVisible(BUTTONS.UPDATE_PUBLIC) && (
              <Button
                disabled={!authenticated}
                iconLeft={<IconPen />}
                onClick={() => onUpdate(PublicationStatus.Public)}
                title={
                  authenticated ? '' : t('authentication.noRightsCreateEvent')
                }
                type="button"
              >
                {t('event.form.buttonUpdatePublic')}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EditButtonPanel;
