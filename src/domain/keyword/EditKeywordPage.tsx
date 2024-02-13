import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
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
import useAuth from '../auth/hooks/useAuth';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { KEYWORD_ACTIONS } from './constants';
import useKeywordUpdateActions, {
  KEYWORD_MODALS,
} from './hooks/useKeywordActions';
import KeywordForm from './keywordForm/KeywordForm';
import ConfirmDeleteKeywordModal from './modals/confirmDeleteKeywordModal/ConfirmDeleteKeywordModal';
import {
  getEditButtonProps,
  getKeywordFields,
  keywordPathBuilder,
} from './utils';

type Props = {
  keyword: KeywordFieldsFragment;
};

const EditKeywordPage: React.FC<Props> = ({ keyword }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { publisher } = getKeywordFields(keyword, locale);
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deleteKeyword, openModal, saving, setOpenModal } =
    useKeywordUpdateActions({
      keyword,
    });

  const goToKeywordsPage = () => {
    navigate(`/${locale}${ROUTES.KEYWORDS}`);
  };

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

  const buttonProps = getEditButtonProps({
    action: KEYWORD_ACTIONS.DELETE,
    authenticated,
    onClick: () => setOpenModal(KEYWORD_MODALS.DELETE),
    organizationAncestors,
    publisher,
    t,
    user,
  });

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
        button={
          <Button
            {...buttonProps}
            fullWidth={true}
            iconLeft={buttonProps.icon}
            variant="danger"
          >
            {buttonProps.label}
          </Button>
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
