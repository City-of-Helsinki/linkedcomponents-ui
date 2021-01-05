import { IconPlus } from 'hds-react/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Button from '../,,/../../common/components/button/Button';
import LoadingSpinner from '../,,/../../common/components/loadingSpinner/LoadingSpinner';
import TabPanel from '../../common/components/tabs/TabPanel';
import Tabs from '../../common/components/tabs/Tabs';
import { ROUTES } from '../../constants';
import {
  PublicationStatus,
  useEventsQuery,
  UserFieldsFragment,
  useUserQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { userSelector } from '../auth/selectors';
import { eventsPathBuilder } from '../events/utils';
import NotSigned from '../notSigned/NotSigned';
import { getUserFields, userPathBuilder } from '../user/utils';
import { EVENTS_PAGE_SIZE } from './constants';
import EventList from './eventList/EventList';
import styles from './events.module.scss';

enum TABS {
  DRAFTS = 'DRAFTS',
  PUBLISHED = 'PUBLISHED',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
}

interface Props {
  user: UserFieldsFragment;
}

const getEventListVariables = (tab: TABS, adminOrganizations: string[]) => {
  const baseVariables = {
    include: ['in_language', 'location'],
    pageSize: EVENTS_PAGE_SIZE,
    superEventType: ['none'],
    createPath: getPathBuilder(eventsPathBuilder),
  };

  switch (tab) {
    case TABS.DRAFTS:
      return {
        ...baseVariables,
        createdBy: 'me',
        publicationStatus: PublicationStatus.Draft,
        showAll: true,
      };
    case TABS.PUBLISHED:
      return {
        ...baseVariables,
        adminUser: true,
        publisher: adminOrganizations,
        publicationStatus: PublicationStatus.Public,
      };
    case TABS.WAITING_APPROVAL:
      return {
        ...baseVariables,
        adminUser: true,
        publisher: adminOrganizations,
        publicationStatus: PublicationStatus.Draft,
      };
  }
};

const getEventListSkip = (tab: TABS, adminOrganizations: string[]) => {
  switch (tab) {
    case TABS.DRAFTS:
      return false;
    case TABS.PUBLISHED:
    case TABS.WAITING_APPROVAL:
      return !adminOrganizations.length;
  }
};

const EventsPage: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = React.useState<string>(
    TABS.WAITING_APPROVAL
  );
  const locale = useLocale();
  const history = useHistory();
  const { t } = useTranslation();
  const { adminOrganizations } = getUserFields(user);
  const { data: waitingApprovalEventsData } = useEventsQuery({
    skip: getEventListSkip(TABS.WAITING_APPROVAL, adminOrganizations),
    variables: getEventListVariables(TABS.WAITING_APPROVAL, adminOrganizations),
  });
  const { data: publishedEventsData } = useEventsQuery({
    skip: getEventListSkip(TABS.PUBLISHED, adminOrganizations),
    variables: getEventListVariables(TABS.PUBLISHED, adminOrganizations),
  });
  const { data: draftEventsData } = useEventsQuery({
    skip: getEventListSkip(TABS.DRAFTS, adminOrganizations),
    variables: getEventListVariables(TABS.DRAFTS, adminOrganizations),
  });

  const tabOptions = [
    {
      label: t('eventsPage.tabs.waitingApproval', {
        count: waitingApprovalEventsData?.events.meta.count || 0,
      }),
      value: TABS.WAITING_APPROVAL,
    },
    {
      label: t('eventsPage.tabs.published', {
        count: publishedEventsData?.events.meta.count || 0,
      }),
      value: TABS.PUBLISHED,
    },
    {
      label: t('eventsPage.tabs.drafts', {
        count: draftEventsData?.events.meta.count || 0,
      }),
      value: TABS.DRAFTS,
    },
  ];

  const goToCreateEvent = () => {
    history.push(`/${locale}${ROUTES.CREATE_EVENT}`);
  };

  return (
    <PageWrapper backgroundColor="gray" title="eventsPage.pageTitle">
      <MainContent>
        <Container>
          <FormContainer>
            <h1>{t('eventsPage.title')}</h1>
            <div className={styles.navigationRow}>
              <Button
                className={styles.addButton}
                iconLeft={<IconPlus />}
                onClick={goToCreateEvent}
                variant="secondary"
              >
                {t('common.buttonAddEvent')}
              </Button>
              <Tabs
                className={styles.tabSelector}
                name="event-list"
                onChange={setActiveTab}
                options={tabOptions}
                activeTab={activeTab}
              />
            </div>
            {tabOptions.map(({ value }, index) => {
              const isActive = activeTab === value;
              return (
                <TabPanel isActive={isActive} index={index} name="event-list">
                  <EventList
                    skip={getEventListSkip(value, adminOrganizations)}
                    baseVariables={getEventListVariables(
                      value,
                      adminOrganizations
                    )}
                  />
                </TabPanel>
              );
            })}
          </FormContainer>
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

const EventsPageWrapper: React.FC = () => {
  const user = useSelector(userSelector);
  const userId = user?.profile.sub;

  const { data: userData, loading: loadingUser } = useUserQuery({
    skip: !userId,
    variables: {
      id: userId as string,
      createPath: getPathBuilder(userPathBuilder),
    },
  });

  return (
    <LoadingSpinner isLoading={loadingUser}>
      {userData?.user ? <EventsPage user={userData.user} /> : <NotSigned />}
    </LoadingSpinner>
  );
};

export default EventsPageWrapper;
