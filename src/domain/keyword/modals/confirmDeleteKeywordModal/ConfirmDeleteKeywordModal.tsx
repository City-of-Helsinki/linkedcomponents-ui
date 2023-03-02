import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { KEYWORD_ACTION_ICONS, KEYWORD_ACTIONS } from '../../constants';

export type ConfirmDeleteKeywordModalProps = CommonConfirmModalProps;

const ConfirmDeleteKeywordModal: React.FC<ConfirmDeleteKeywordModalProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      confirmButtonIcon={KEYWORD_ACTION_ICONS[KEYWORD_ACTIONS.DELETE]}
      confirmButtonText={t('keyword.deleteKeywordModal.buttonDelete')}
      description={t('keyword.deleteKeywordModal.text')}
      heading={t('keyword.deleteKeywordModal.title')}
      id={'confirm-keyword-delete-modal'}
      variant="danger"
    />
  );
};

export default ConfirmDeleteKeywordModal;
