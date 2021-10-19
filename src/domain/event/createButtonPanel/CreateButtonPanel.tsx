import { useField } from 'formik';
import { IconCheck, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Button from '../../../common/components/button/Button';
import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import styles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { PublicationStatus } from '../../../generated/graphql';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import useUser from '../../user/hooks/useUser';
import { EVENT_CREATE_ACTIONS, EVENT_FIELDS } from '../constants';
import {
  getCreateEventButtonWarning,
  isCreateEventButtonVisible,
} from '../utils';

interface Props {
  onSaveDraft: () => void;
  publisher: string;
  saving: PublicationStatus | null;
}

const CreateButtonPanel: React.FC<Props> = ({
  onSaveDraft,
  publisher,
  saving,
}) => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [{ value: type }] = useField({ name: EVENT_FIELDS.TYPE });
  const authenticated = useSelector(authenticatedSelector);

  const isEventButtonVisible = (action: EVENT_CREATE_ACTIONS) => {
    return isCreateEventButtonVisible({
      action,
      authenticated,
      publisher,
      user,
    });
  };

  const getButtonWarning = (action: EVENT_CREATE_ACTIONS) => {
    return getCreateEventButtonWarning({
      action,
      authenticated,
      publisher,
      t,
      user,
    });
  };

  const createWarning = getButtonWarning(EVENT_CREATE_ACTIONS.CREATE_DRAFT);
  const publishWarning = getButtonWarning(EVENT_CREATE_ACTIONS.PUBLISH);

  return (
    <ButtonPanel
      submitButtons={[
        isEventButtonVisible(EVENT_CREATE_ACTIONS.CREATE_DRAFT) && (
          <Button
            key="create-draft"
            disabled={Boolean(createWarning)}
            fullWidth={true}
            iconLeft={
              saving === PublicationStatus.Draft ? (
                <LoadingSpinner
                  className={styles.loadingSpinner}
                  isLoading={true}
                  small={true}
                />
              ) : (
                <IconPen />
              )
            }
            onClick={onSaveDraft}
            title={createWarning}
            type="button"
            variant="secondary"
          >
            {t('event.form.buttonSaveDraft')}
          </Button>
        ),
        isEventButtonVisible(EVENT_CREATE_ACTIONS.PUBLISH) && (
          <Button
            key="publish"
            disabled={Boolean(publishWarning || saving)}
            fullWidth={true}
            iconLeft={
              saving === PublicationStatus.Public ? (
                <LoadingSpinner
                  className={styles.loadingSpinner}
                  isLoading={true}
                  small={true}
                />
              ) : (
                <IconCheck />
              )
            }
            title={publishWarning}
            type="submit"
          >
            {t(`event.form.buttonPublish.${type}`)}
          </Button>
        ),
      ].filter(skipFalsyType)}
    />
  );
};

export default CreateButtonPanel;
