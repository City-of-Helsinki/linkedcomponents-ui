/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDeleteModal, {
  CommonConfirmDeleteModalProps,
} from '../../../../common/components/dialog/confirmDeleteModal/ConfirmDeleteModal';
import { KEYWORD_SET_ACTION_ICONS, KEYWORD_SET_ACTIONS } from '../../constants';

export type ConfirmDeleteKeywordSetModalProps = CommonConfirmDeleteModalProps;

const ConfirmDeleteKeywordSetModal: React.FC<
  ConfirmDeleteKeywordSetModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <ConfirmDeleteModal
      {...props}
      deleteButtonIcon={KEYWORD_SET_ACTION_ICONS[KEYWORD_SET_ACTIONS.DELETE]}
      deleteButtonText={t('keywordSet.deleteKeywordSetModal.buttonDelete')}
      description={t('keywordSet.deleteKeywordSetModal.text')}
      heading={t('keywordSet.deleteKeywordSetModal.title')}
      id={'confirm-keyword-set-delete-modal'}
    />
  );
};

export default ConfirmDeleteKeywordSetModal;
