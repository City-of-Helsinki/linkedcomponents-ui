import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDeleteModal, {
  CommonConfirmDeleteModalProps,
} from '../../../../common/components/dialog/confirmDeleteModal/ConfirmDeleteModal';
import { KEYWORD_ACTION_ICONS, KEYWORD_ACTIONS } from '../../constants';

export type ConfirmDeleteKeywordModalProps = CommonConfirmDeleteModalProps;

const ConfirmDeleteKeywordModal: React.FC<ConfirmDeleteKeywordModalProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <ConfirmDeleteModal
      {...props}
      deleteButtonIcon={KEYWORD_ACTION_ICONS[KEYWORD_ACTIONS.DELETE]}
      deleteButtonText={t('keyword.deleteKeywordModal.buttonDelete')}
      description={t('keyword.deleteKeywordModal.text')}
      heading={t('keyword.deleteKeywordModal.title')}
      id={'confirm-keyword-delete-modal'}
    />
  );
};

export default ConfirmDeleteKeywordModal;
