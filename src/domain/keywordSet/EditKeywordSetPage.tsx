/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
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
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { authenticatedSelector } from '../auth/selectors';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import useUserOrganization from '../user/hooks/useUserOrganization';
import { KEYWORD_SET_ACTIONS } from './constants';
import useKeywordSetUpdateActions, {
  KEYWORD_SET_MODALS,
} from './hooks/useKeywordSetUpdateActions';
import KeywordSetForm from './keywordSetForm/KeywordSetForm';
import ConfirmDeleteModal from './modals/confirmDeleteModal/ConfirmDeleteModal';
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
  const locale = useLocale();
  const navigate = useNavigate();
  const authenticated = useSelector(authenticatedSelector);
  const { dataSource } = getKeywordSetFields(keywordSet, locale);
  const { user } = useUser();
  const { organization: userOrganization } = useUserOrganization(user);

  const { closeModal, deleteKeywordSet, openModal, setOpenModal, saving } =
    useKeywordSetUpdateActions({
      keywordSet,
    });

  const goToKeywordSetsPage = () => {
    navigate(`/${locale}${ROUTES.KEYWORD_SETS}`);
  };

  const onDelete = () => {
    deleteKeywordSet({
      onSuccess: () => goToKeywordSetsPage(),
    });
  };

  const buttonProps = getEditButtonProps({
    action: KEYWORD_SET_ACTIONS.DELETE,
    authenticated,
    dataSource,
    onClick: () => setOpenModal(KEYWORD_SET_MODALS.DELETE),
    t,
    userOrganization,
  });

  return (
    <div>
      <ConfirmDeleteModal
        isOpen={openModal === KEYWORD_SET_MODALS.DELETE}
        isSaving={saving === KEYWORD_SET_ACTIONS.DELETE}
        onClose={closeModal}
        onDelete={onDelete}
      />

      <TitleRow
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
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.KEYWORD_SETS}>
          {t('keywordSetsPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('editKeywordSetPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
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
        id: id as string,
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
