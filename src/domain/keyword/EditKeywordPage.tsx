import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';

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
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { useAuth } from '../auth/hooks/useAuth';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { KEYWORD_ACTIONS } from './constants';
import useKeywordUpdateActions, {
  KEYWORD_MODALS,
} from './hooks/useKeywordActions';
import KeywordForm from './keywordForm/KeywordForm';
import ConfirmDeleteModal from './modals/confirmDeleteModal/ConfirmDeleteModal';
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
  const locale = useLocale();
  const navigate = useNavigate();
  const { publisher } = getKeywordFields(keyword, locale);
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deleteKeyword, openModal, saving, setOpenModal } =
    useKeywordUpdateActions({
      keyword,
    });

  const goToKeywordsPage = () => {
    navigate(`/${locale}${ROUTES.KEYWORDS}`);
  };

  const onDelete = () => {
    deleteKeyword({
      onSuccess: () => goToKeywordsPage(),
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
      <ConfirmDeleteModal
        isOpen={openModal === KEYWORD_MODALS.DELETE}
        isSaving={saving === KEYWORD_ACTIONS.DELETE}
        onClose={closeModal}
        onDelete={onDelete}
      />
      <TitleRow
        breadcrumb={
          <Breadcrumb
            items={[
              { label: t('common.home'), to: ROUTES.HOME },
              { label: t('adminPage.title'), to: ROUTES.ADMIN },
              { label: t('keywordsPage.title'), to: ROUTES.KEYWORDS },
              { active: true, label: t('editKeywordPage.title') },
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
  const location = useLocation();
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: keywordData, loading: loadingKeyword } = useKeywordQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      createPath: getPathBuilder(keywordPathBuilder),
      id: id as string,
    },
  });

  const keyword = keywordData?.keyword;

  const loading = loadingUser || loadingKeyword;

  return (
    <PageWrapper title="editKeywordPage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {keyword ? (
          <EditKeywordPage keyword={keyword} />
        ) : (
          <NotFound
            pathAfterSignIn={`${location.pathname}${location.search}`}
          />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditKeywordPageWrapper;
