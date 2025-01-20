import { Button, ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  PriceGroupFieldsFragment,
  usePriceGroupQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getValue from '../../utils/getValue';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { useNotificationsContext } from '../app/notificationsContext/hooks/useNotificationsContext';
import useAuth from '../auth/hooks/useAuth';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { PRICE_GROUP_ACTIONS } from './constants';
import usePriceGroupActions, {
  PRICE_GROUP_MODALS,
} from './hooks/usePriceGroupActions';
import ConfirmDeletePriceGroupModal from './modals/confirmDeletePriceGroupModal/ConfirmDeletePriceGroupModal';
import PriceGroupForm from './priceGroupForm/PriceGroupForm';
import { getEditPriceGroupButtonProps, getPriceGroupFields } from './utils';

type Props = {
  priceGroup: PriceGroupFieldsFragment;
};

const EditPriceGroupPage: React.FC<Props> = ({ priceGroup }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const navigate = useNavigate();
  const locale = useLocale();
  const { publisher } = getPriceGroupFields(priceGroup, locale);
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const { closeModal, deletePriceGroup, openModal, saving, setOpenModal } =
    usePriceGroupActions({
      priceGroup,
    });

  const goToPriceGroupsPage = () => {
    navigate(`/${locale}${ROUTES.PRICE_GROUPS}`);
  };

  const handleDelete = () => {
    deletePriceGroup({
      onSuccess: () => {
        goToPriceGroupsPage();
        addNotification({
          label: t('priceGroup.form.notificationPriceGroupDeleted'),
          type: 'success',
        });
      },
    });
  };

  const buttonProps = getEditPriceGroupButtonProps({
    action: PRICE_GROUP_ACTIONS.DELETE,
    authenticated,
    onClick: () => setOpenModal(PRICE_GROUP_MODALS.DELETE),
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return (
    <div>
      <ConfirmDeletePriceGroupModal
        isOpen={openModal === PRICE_GROUP_MODALS.DELETE}
        isSaving={saving === PRICE_GROUP_ACTIONS.DELETE}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('adminPage.title'), path: ROUTES.ADMIN },
              { title: t('priceGroupsPage.title'), path: ROUTES.PRICE_GROUPS },
              { title: t('editPriceGroupPage.title'), path: null },
            ]}
          />
        }
        button={
          <Button
            {...buttonProps}
            fullWidth={true}
            iconStart={buttonProps.icon}
            variant={ButtonVariant.Danger}
          >
            {buttonProps.label}
          </Button>
        }
        title={t('editPriceGroupPage.title')}
      />

      <PriceGroupForm priceGroup={priceGroup} />
    </div>
  );
};

const EditPriceGroupPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();

  const { data: priceGroupData, loading: loadingPriceGroup } =
    usePriceGroupQuery({
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
      variables: {
        id: getValue(id, ''),
      },
    });

  const priceGroup = priceGroupData?.priceGroup;
  const loading = loadingUser || loadingPriceGroup;

  return (
    <PageWrapper
      description="editPriceGroupPage.pageDescription"
      keywords={['keywords.priceGroup', 'keywords.edit']}
      title="editPriceGroupPage.pageTitle"
    >
      <LoadingSpinner isLoading={loading}>
        {priceGroup ? (
          <EditPriceGroupPage priceGroup={priceGroup} />
        ) : (
          <NotFound />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EditPriceGroupPageWrapper;
