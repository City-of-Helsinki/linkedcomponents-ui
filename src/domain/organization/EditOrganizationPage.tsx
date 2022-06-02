import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  OrganizationFieldsFragment,
  useOrganizationQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { authenticatedSelector } from '../auth/selectors';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import { ORGANIZATION_ACTIONS } from './constants';
import useOrganizationAncestors from './hooks/useOrganizationAncestors';
import useOrganizationUpdateActions, {
  ORGANIZATION_MODALS,
} from './hooks/useOrganizationUpdateActions';
import ConfirmDeleteModal from './modals/confirmDeleteModal/ConfirmDeleteModal';
import OrganizationForm from './organizationForm/OrganizationForm';
import {
  getEditButtonProps,
  getOrganizationFields,
  organizationPathBuilder,
} from './utils';

type Props = {
  organization: OrganizationFieldsFragment;
};

const EditOrganizationPage: React.FC<Props> = ({ organization }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { id } = getOrganizationFields(organization, locale, t);
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(id);

  const { closeModal, deleteOrganization, openModal, setOpenModal, saving } =
    useOrganizationUpdateActions({
      organization,
    });

  const goToOrganizationsPage = () => {
    navigate(`/${locale}${ROUTES.ORGANIZATIONS}`);
  };

  const onDelete = () => {
    deleteOrganization({
      onSuccess: () => goToOrganizationsPage(),
    });
  };

  const buttonProps = getEditButtonProps({
    action: ORGANIZATION_ACTIONS.DELETE,
    authenticated,
    id,
    onClick: () => setOpenModal(ORGANIZATION_MODALS.DELETE),
    organizationAncestors,
    t,
    user,
  });

  return (
    <div>
      <ConfirmDeleteModal
        isOpen={openModal === ORGANIZATION_MODALS.DELETE}
        isSaving={saving === ORGANIZATION_ACTIONS.DELETE}
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
        title={t('editOrganizationPage.title')}
      />
      <Breadcrumb>
        <Breadcrumb.Item to={ROUTES.HOME}>{t('common.home')}</Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ADMIN}>
          {t('adminPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item to={ROUTES.ORGANIZATIONS}>
          {t('organizationsPage.title')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active={true}>
          {t('editOrganizationPage.title')}
        </Breadcrumb.Item>
      </Breadcrumb>
      <OrganizationForm organization={organization} />
    </div>
  );
};

const EditOrganizationPageWrapper: React.FC = () => {
  const location = useLocation();
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: organizationData, loading: loadingOrganization } =
    useOrganizationQuery({
      fetchPolicy: 'no-cache',
      skip: loadingUser,
      variables: {
        id: id as string,
        createPath: getPathBuilder(organizationPathBuilder),
      },
    });

  const organization = organizationData?.organization;

  const loading = loadingUser || loadingOrganization;

  return (
    <PageWrapper title="editOrganizationPage.pageTitle">
      <LoadingSpinner isLoading={loading}>
        {organization ? (
          <EditOrganizationPage organization={organization} />
        ) : (
          <NotFound
            pathAfterSignIn={`${location.pathname}${location.search}`}
          />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditOrganizationPageWrapper;
