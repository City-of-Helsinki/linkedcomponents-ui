import { ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import TabPanel from '../../common/components/tabs/tabPanel/TabPanel';
import Tabs from '../../common/components/tabs/Tabs';
import { ROUTES } from '../../constants';
import { useEventsQuery, UserFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import { usePageSettings } from '../app/hooks/usePageSettings';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { clearEventFormData } from '../event/utils';
import NotSigned from '../notSigned/NotSigned';
import useUser from '../user/hooks/useUser';
import { EVENT_LIST_TYPES, EVENTS_PAGE_TABS } from './constants';
import EventList from './eventList/EventList';
import styles from './events.module.scss';
import useEventsQueryVariables from './hooks/useEventsQueryVariables';
import SearchPanel from './searchPanel/SearchPanel';
import { replaceParamsToEventQueryString } from './utils';

interface Props {
  user: UserFieldsFragment;
}

const EventsPage: React.FC<Props> = ({ user }) => {
  const {
    events: {
      listOptions: { tab: activeTab, listType },
      setEventListOptions,
    },
  } = usePageSettings();

  const setActiveTab = async (selectedTab: EVENTS_PAGE_TABS) => {
    setEventListOptions({ tab: selectedTab });
  };

  const setListType = (selectedListType: EVENT_LIST_TYPES) => {
    setEventListOptions({ listType: selectedListType });
  };

  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { skip: waitingApprovalSkip, variables: waitingApprovalVariables } =
    useEventsQueryVariables(EVENTS_PAGE_TABS.WAITING_APPROVAL, user);
  const { data: waitingApprovalEventsData } = useEventsQuery({
    skip: waitingApprovalSkip,
    variables: waitingApprovalVariables,
  });

  const { skip: publishedSkip, variables: publishedVariables } =
    useEventsQueryVariables(EVENTS_PAGE_TABS.PUBLISHED, user);
  const { data: publishedEventsData } = useEventsQuery({
    skip: publishedSkip,
    variables: publishedVariables,
  });

  const { skip: ownPublishedSkip, variables: ownPublishedVariables } =
    useEventsQueryVariables(EVENTS_PAGE_TABS.OWN_PUBLISHED, user);
  const { data: ownPublishedEventsData } = useEventsQuery({
    skip: ownPublishedSkip,
    variables: ownPublishedVariables,
  });

  const { skip: draftsSkip, variables: draftsVariables } =
    useEventsQueryVariables(EVENTS_PAGE_TABS.DRAFTS, user);
  const { data: draftEventsData } = useEventsQuery({
    skip: draftsSkip,
    variables: draftsVariables,
  });

  const tabOptions = [
    {
      label: t('eventsPage.tabs.waitingApproval', {
        count: waitingApprovalEventsData?.events?.meta.count ?? 0,
      }),
      value: EVENTS_PAGE_TABS.WAITING_APPROVAL,
    },
    {
      label: t('eventsPage.tabs.published', {
        count: publishedEventsData?.events?.meta.count ?? 0,
      }),
      value: EVENTS_PAGE_TABS.PUBLISHED,
    },
    {
      label: t('eventsPage.tabs.ownPublished', {
        count: ownPublishedEventsData?.events?.meta.count ?? 0,
      }),
      value: EVENTS_PAGE_TABS.OWN_PUBLISHED,
    },
    {
      label: t('eventsPage.tabs.drafts', {
        count: draftEventsData?.events?.meta.count ?? 0,
      }),
      value: EVENTS_PAGE_TABS.DRAFTS,
    },
  ];

  const goToCreateEvent = () => {
    clearEventFormData();
    navigate(`/${locale}${ROUTES.CREATE_EVENT}`);
  };

  const handleChangeTab = (newTab: string) => {
    setActiveTab(newTab as EVENTS_PAGE_TABS);
    navigate({
      pathname: location.pathname,
      search: replaceParamsToEventQueryString(location.search, { page: null }),
    });
  };

  return (
    <div className={styles.eventsPage}>
      <Container withOffset={true}>
        <TitleRow
          breadcrumb={
            <Breadcrumb
              list={[
                { title: t('common.home'), path: ROUTES.HOME },
                { title: t(`eventsPage.title`), path: null },
              ]}
            />
          }
          button={
            <Button
              className={styles.addButton}
              fullWidth={true}
              iconStart={<IconPlus aria-hidden={true} />}
              onClick={goToCreateEvent}
              variant={ButtonVariant.Primary}
            >
              {t('common.buttonAddEvent')}
            </Button>
          }
          title={t('eventsPage.title')}
        />

        <Tabs
          className={styles.tabSelector}
          name="event-list"
          onChange={handleChangeTab}
          options={tabOptions}
          activeTab={activeTab}
        />
      </Container>

      {tabOptions.map(({ value: tab }, index) => {
        const skip = {
          [EVENTS_PAGE_TABS.DRAFTS]: draftsSkip,
          [EVENTS_PAGE_TABS.OWN_PUBLISHED]: ownPublishedSkip,
          [EVENTS_PAGE_TABS.PUBLISHED]: publishedSkip,
          [EVENTS_PAGE_TABS.WAITING_APPROVAL]: waitingApprovalSkip,
        };
        const variables = {
          [EVENTS_PAGE_TABS.DRAFTS]: draftsVariables,
          [EVENTS_PAGE_TABS.OWN_PUBLISHED]: ownPublishedVariables,
          [EVENTS_PAGE_TABS.PUBLISHED]: publishedVariables,
          [EVENTS_PAGE_TABS.WAITING_APPROVAL]: waitingApprovalVariables,
        };

        const isActive = activeTab === tab;

        return (
          <TabPanel
            key={tab}
            className={styles.tabPanel}
            isActive={isActive}
            index={index}
            name="event-list"
          >
            <SearchPanel />

            <EventList
              activeTab={activeTab}
              baseVariables={variables[tab]}
              className={styles.eventList}
              listType={listType}
              setListType={setListType}
              showListTypeSelector={true}
              skip={skip[tab]}
            />
          </TabPanel>
        );
      })}
    </div>
  );
};

const EventsPageWrapper: React.FC = () => {
  const { loading: loadingUser, user } = useUser();

  return (
    <PageWrapper
      backgroundColor={user ? 'gray' : 'white'}
      description="eventsPage.pageDescription"
      keywords={['keywords.myListing', 'keywords.edit', 'keywords.update']}
      title="eventsPage.pageTitle"
    >
      <MainContent>
        <LoadingSpinner isLoading={loadingUser}>
          {user ? <EventsPage user={user} /> : <NotSigned />}
        </LoadingSpinner>
      </MainContent>
    </PageWrapper>
  );
};

export default EventsPageWrapper;
