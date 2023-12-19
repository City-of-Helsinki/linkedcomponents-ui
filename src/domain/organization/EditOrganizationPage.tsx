import React from 'react';
import { useTranslation } from 'react-i18next';
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
import getValue from '../../utils/getValue';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { useNotificationsContext } from '../app/notificationsContext/hooks/useNotificationsContext';
import useAuth from '../auth/hooks/useAuth';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import { ORGANIZATION_ACTIONS } from './constants';
import useOrganizationUpdateActions, {
  ORGANIZATION_MODALS,
} from './hooks/useOrganizationActions';
import ConfirmDeleteOrganizationModal from './modals/confirmDeleteOrganizationModal/ConfirmDeleteOrganizationModal';
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
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { id } = getOrganizationFields(organization, locale, t);
  const { authenticated } = useAuth();
  const { user } = useUser();

  const { closeModal, deleteOrganization, openModal, setOpenModal, saving } =
    useOrganizationUpdateActions({
      organization,
    });

  const goToOrganizationsPage = () => {
    navigate(`/${locale}${ROUTES.ORGANIZATIONS}`);
  };

  const handleDelete = () => {
    deleteOrganization({
      onSuccess: () => {
        goToOrganizationsPage();
        addNotification({
          label: t('organization.form.notificationOrganizationDeleted'),
          type: 'success',
        });
      },
    });
  };

  const buttonProps = getEditButtonProps({
    action: ORGANIZATION_ACTIONS.DELETE,
    authenticated,
    id,
    onClick: () => setOpenModal(ORGANIZATION_MODALS.DELETE),
    t,
    user,
  });

  return (
    <div>
      <ConfirmDeleteOrganizationModal
        isOpen={openModal === ORGANIZATION_MODALS.DELETE}
        isSaving={saving === ORGANIZATION_ACTIONS.DELETE}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              {
                title: t('organizationsPage.title'),
                path: ROUTES.ORGANIZATIONS,
              },
              { title: t('editOrganizationPage.title'), path: null },
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
        title={t('editOrganizationPage.title')}
      />

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
        id: getValue(id, ''),
        createPath: getPathBuilder(organizationPathBuilder),
        dissolved: false,
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
