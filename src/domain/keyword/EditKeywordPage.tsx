import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  KeywordFieldsFragment,
  useKeywordQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { useNotificationsContext } from '../app/notificationsContext/hooks/useNotificationsContext';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import { KEYWORD_ACTIONS } from './constants';
import useKeywordUpdateActions, {
  KEYWORD_MODALS,
} from './hooks/useKeywordActions';
import KeywordForm from './keywordForm/KeywordForm';
import ConfirmDeleteKeywordModal from './modals/confirmDeleteKeywordModal/ConfirmDeleteKeywordModal';
import { keywordPathBuilder } from './utils';

type Props = {
  keyword: KeywordFieldsFragment;
};

const EditKeywordPage: React.FC<Props> = ({ keyword }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();

  const { closeModal, deleteKeyword, openModal, saving } =
    useKeywordUpdateActions({
      keyword,
    });

  /* istanbul ignore next */
  const goToKeywordsPage = () => {
    navigate(`/${locale}${ROUTES.KEYWORDS}`);
  };

  /* istanbul ignore next */
  const handleDelete = () => {
    deleteKeyword({
      onSuccess: () => {
        goToKeywordsPage();
        addNotification({
          label: t('keyword.form.notificationKeywordDeleted'),
          type: 'success',
        });
      },
    });
  };

  return (
    <div>
      <ConfirmDeleteKeywordModal
        isOpen={openModal === KEYWORD_MODALS.DELETE}
        isSaving={saving === KEYWORD_ACTIONS.DELETE}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('keywordsPage.title'), path: ROUTES.KEYWORDS },
              { title: t('editKeywordPage.title'), path: null },
            ]}
          />
        }
        title={t('editKeywordPage.title')}
      />

      <KeywordForm keyword={keyword} />
    </div>
  );
};

const EditKeywordPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: keywordData, loading: loadingKeyword } = useKeywordQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      createPath: getPathBuilder(keywordPathBuilder),
      id: getValue(id, ''),
    },
  });

  const keyword = keywordData?.keyword;

  const loading = loadingUser || loadingKeyword;

  return (
    <PageWrapper title="editKeywordPage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {keyword ? <EditKeywordPage keyword={keyword} /> : <NotFound />}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditKeywordPageWrapper;
