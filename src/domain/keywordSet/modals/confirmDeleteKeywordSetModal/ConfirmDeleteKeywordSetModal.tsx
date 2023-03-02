/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { KEYWORD_SET_ACTION_ICONS, KEYWORD_SET_ACTIONS } from '../../constants';

export type ConfirmDeleteKeywordSetModalProps = CommonConfirmModalProps;

const ConfirmDeleteKeywordSetModal: React.FC<
  ConfirmDeleteKeywordSetModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      confirmButtonIcon={KEYWORD_SET_ACTION_ICONS[KEYWORD_SET_ACTIONS.DELETE]}
      confirmButtonText={t('keywordSet.deleteKeywordSetModal.buttonDelete')}
      description={t('keywordSet.deleteKeywordSetModal.text')}
      heading={t('keywordSet.deleteKeywordSetModal.title')}
      id={'confirm-keyword-set-delete-modal'}
      variant="danger"
    />
  );
};

export default ConfirmDeleteKeywordSetModal;
