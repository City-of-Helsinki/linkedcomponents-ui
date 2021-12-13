import { useField } from 'formik';
import { IconCheck, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
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
          <LoadingButton
            key="create-draft"
            disabled={Boolean(createWarning)}
            fullWidth={true}
            icon={<IconPen aria-hidden={true} />}
            loading={saving === PublicationStatus.Draft}
            onClick={onSaveDraft}
            title={createWarning}
            type="button"
            variant="secondary"
          >
            {t('event.form.buttonSaveDraft')}
          </LoadingButton>
        ),
        isEventButtonVisible(EVENT_CREATE_ACTIONS.PUBLISH) && (
          <LoadingButton
            key="publish"
            disabled={Boolean(publishWarning || saving)}
            fullWidth={true}
            icon={<IconCheck aria-hidden={true} />}
            loading={saving === PublicationStatus.Public}
            title={publishWarning}
            type="submit"
          >
            {t(`event.form.buttonPublish.${type}`)}
          </LoadingButton>
        ),
      ].filter(skipFalsyType)}
    />
  );
};

export default CreateButtonPanel;
