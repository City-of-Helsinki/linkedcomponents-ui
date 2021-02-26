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
import useUser from '../../user/hooks/useUser';
import { EVENT_ACTIONS } from '../constants';
import useEventOrganizationAncestors from '../hooks/useEventOrganizationAncestors';
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

  const { organizationAncestors } = useEventOrganizationAncestors(event);
  const { user } = useUser();

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
    action,
    onClick,
  }: {
    action: EVENT_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getActionButtonProps({
      action,
      authenticated,
      event,
      onClick,
      organizationAncestors,
      t,
      user,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: EVENT_ACTIONS.COPY,
      onClick: copyEvent,
    }),
    /* Actions for draft event */
    getActionItemProps({
      action: EVENT_ACTIONS.UPDATE_DRAFT,
      onClick: () => onUpdate(PublicationStatus.Draft),
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.PUBLISH,
      onClick: () => onUpdate(PublicationStatus.Public),
    }),
    /* Actions for public event */
    getActionItemProps({
      action: EVENT_ACTIONS.UPDATE_PUBLIC,
      onClick: () => onUpdate(PublicationStatus.Public),
    }),
    /* Actions for all event */
    getActionItemProps({
      action: EVENT_ACTIONS.POSTPONE,
      onClick: onPostpone,
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.CANCEL,
      onClick: onCancel,
    }),
    getActionItemProps({
      action: EVENT_ACTIONS.DELETE,
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
