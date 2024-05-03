/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  KeywordSetFieldsFragment,
  useKeywordSetQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { useNotificationsContext } from '../app/notificationsContext/hooks/useNotificationsContext';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import { KEYWORD_SET_ACTIONS } from './constants';
import useKeywordSetUpdateActions, {
  KEYWORD_SET_MODALS,
} from './hooks/useKeywordSetActions';
import KeywordSetForm from './keywordSetForm/KeywordSetForm';
import ConfirmDeleteKeywordSetModal from './modals/confirmDeleteKeywordSetModal/ConfirmDeleteKeywordSetModal';
import { keywordSetPathBuilder } from './utils';

type Props = {
  keywordSet: KeywordSetFieldsFragment;
};

const EditKeywordSetPage: React.FC<Props> = ({ keywordSet }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();

  const { closeModal, deleteKeywordSet, openModal, saving } =
    useKeywordSetUpdateActions({
      keywordSet,
    });

  const goToKeywordSetsPage = () => {
    navigate(`/${locale}${ROUTES.KEYWORD_SETS}`);
  };

  const handleDelete = () => {
    deleteKeywordSet({
      onSuccess: () => {
        goToKeywordSetsPage();
        addNotification({
          label: t('keywordSet.form.notificationKeywordSetDeleted'),
          type: 'success',
        });
      },
    });
  };

  return (
    <div>
      <ConfirmDeleteKeywordSetModal
        isOpen={openModal === KEYWORD_SET_MODALS.DELETE}
        isSaving={saving === KEYWORD_SET_ACTIONS.DELETE}
        onClose={closeModal}
        onConfirm={handleDelete}
      />

      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('keywordSetsPage.title'), path: ROUTES.KEYWORD_SETS },
              { title: t('editKeywordSetPage.title'), path: null },
            ]}
          />
        }
        title={t('editKeywordSetPage.title')}
      />

      <KeywordSetForm keywordSet={keywordSet} />
    </div>
  );
};

const EditKeywordSetPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: keywordSetData, loading: loadingKeywordSet } =
    useKeywordSetQuery({
      fetchPolicy: 'no-cache',
      variables: {
        createPath: getPathBuilder(keywordSetPathBuilder),
        id: getValue(id, ''),
      },
    });

  const keywordSet = keywordSetData?.keywordSet;

  const loading = loadingUser || loadingKeywordSet;

  return (
    <PageWrapper title="editKeywordSetPage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {keywordSet ? (
          <EditKeywordSetPage keywordSet={keywordSet} />
        ) : (
          <NotFound />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditKeywordSetPageWrapper;
