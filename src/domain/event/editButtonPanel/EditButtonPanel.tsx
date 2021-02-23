import { IconArrowLeft } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Button from '../../../common/components/button/Button';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { PAGE_HEADER_ID, ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useWindowSize from '../../../hooks/useWindowSize';
import Container from '../../app/layout/Container';
import { authenticatedSelector } from '../../auth/selectors';
import { EVENT_ACTION_BUTTONS } from '../constants';
import { copyEventToSessionStorage, getActionButtonProps } from '../utils';
import styles from './editButtonPanel.module.scss';

export interface EditButtonPanelProps {
  event: EventFieldsFragment;
  onCancel: () => void;
  onDelete: () => void;
  onPostpone: () => void;
  onUpdate: (publicationStatus: PublicationStatus) => void;
}

const getTop = (): number => {
  const pageHeader = document.getElementById(PAGE_HEADER_ID);
  return pageHeader?.clientHeight ? pageHeader.clientHeight - 2 : 0;
};

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  event,
  onCancel,
  onDelete,
  onPostpone,
  onUpdate,
}) => {
  const [top, setTop] = React.useState(getTop());
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory();
  const windowSize = useWindowSize();

  const goToEventsPage = () => {
    history.push(`/${locale}${ROUTES.EVENTS}`);
  };

  const copyEvent = async () => {
    await copyEventToSessionStorage(event);
    history.push(`/${locale}${ROUTES.CREATE_EVENT}`);
  };

  React.useEffect(() => {
    setTop(getTop());
  }, [windowSize]);

  const getActionItemProps = ({
    button,
    onClick,
  }: {
    button: EVENT_ACTION_BUTTONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getActionButtonProps({
      authenticated,
      button,
      event,
      onClick,
      t,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    /* Actions for draft event */
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.UPDATE_DRAFT,
      onClick: () => onUpdate(PublicationStatus.Draft),
    }),
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.PUBLISH,
      onClick: () => onUpdate(PublicationStatus.Public),
    }),
    /* Actions for public event */
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.UPDATE_PUBLIC,
      onClick: () => onUpdate(PublicationStatus.Public),
    }),
    /* Actions for all event */
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.COPY,
      onClick: copyEvent,
    }),
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.POSTPONE,
      onClick: onPostpone,
    }),
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.CANCEL,
      onClick: onCancel,
    }),
    getActionItemProps({
      button: EVENT_ACTION_BUTTONS.DELETE,
      onClick: onDelete,
    }),
  ].filter((i) => i) as MenuItemOptionProps[];

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
          <div className={styles.editButtonWrapper}>
            <MenuDropdown
              buttonLabel={t('event.form.buttonActions')}
              closeOnItemClick={true}
              items={actionItems}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EditButtonPanel;
