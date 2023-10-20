/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';

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
import { useAuth } from '../auth/hooks/useAuth';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { KEYWORD_SET_ACTIONS } from './constants';
import useKeywordSetUpdateActions, {
  KEYWORD_SET_MODALS,
} from './hooks/useKeywordSetActions';
import KeywordSetForm from './keywordSetForm/KeywordSetForm';
import ConfirmDeleteKeywordSetModal from './modals/confirmDeleteKeywordSetModal/ConfirmDeleteKeywordSetModal';
import {
  getEditButtonProps,
  getKeywordSetFields,
  keywordSetPathBuilder,
} from './utils';

type Props = {
  keywordSet: KeywordSetFieldsFragment;
};

const EditKeywordSetPage: React.FC<Props> = ({ keywordSet }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAuthenticated: authenticated } = useAuth();
  const { organization } = getKeywordSetFields(keywordSet, locale);
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(organization);

  const { closeModal, deleteKeywordSet, openModal, setOpenModal, saving } =
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

  const buttonProps = getEditButtonProps({
    action: KEYWORD_SET_ACTIONS.DELETE,
    authenticated,
    onClick: () => setOpenModal(KEYWORD_SET_MODALS.DELETE),
    organizationAncestors,
    organization,
    t,
    user,
  });

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
        title={t('editKeywordSetPage.title')}
      />

      <KeywordSetForm keywordSet={keywordSet} />
    </div>
  );
};

const EditKeywordSetPageWrapper: React.FC = () => {
  const location = useLocation();
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
          <NotFound
            pathAfterSignIn={`${location.pathname}${location.search}`}
          />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditKeywordSetPageWrapper;
