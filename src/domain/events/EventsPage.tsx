import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import TabPanel from '../../common/components/tabs/TabPanel';
import Tabs from '../../common/components/tabs/Tabs';
import { ROUTES } from '../../constants';
import { useEventsQuery, UserFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { clearEventFormData } from '../event/utils';
import FilterSummary from '../eventSearch/filterSummary/FilterSummary';
import { replaceParamsToEventQueryString } from '../eventSearch/utils';
import NotSigned from '../notSigned/NotSigned';
import useUser from '../user/hooks/useUser';
import { setEventListOptions } from './actions';
import { EVENT_LIST_TYPES, EVENTS_PAGE_TABS } from './constants';
import EventList from './eventList/EventList';
import styles from './events.module.scss';
import useEventsQueryVariables from './hooks/useEventsQueryVariables';
import SearchPanel from './searchPanel/SearchPanel';
import { eventListTabSelector, eventListTypeSelector } from './selectors';

interface Props {
  user: UserFieldsFragment;
}

const EventsPage: React.FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(eventListTabSelector);
  const listType = useSelector(eventListTypeSelector);

  const setActiveTab = async (selectedTab: EVENTS_PAGE_TABS) => {
    dispatch(setEventListOptions({ tab: selectedTab }));
  };

  const setListType = (selectedListType: EVENT_LIST_TYPES) => {
    dispatch(setEventListOptions({ listType: selectedListType }));
  };

  const locale = useLocale();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    skip: waitingApprovalSkip,
    variables: waitingApprovalVariables,
  } = useEventsQueryVariables(EVENTS_PAGE_TABS.WAITING_APPROVAL, user);
  const { data: waitingApprovalEventsData } = useEventsQuery({
    skip: waitingApprovalSkip,
    variables: waitingApprovalVariables,
  });

  const {
    skip: publishedSkip,
    variables: publishedVariables,
  } = useEventsQueryVariables(EVENTS_PAGE_TABS.PUBLISHED, user);
  const { data: publishedEventsData } = useEventsQuery({
    skip: publishedSkip,
    variables: publishedVariables,
  });

  const {
    skip: draftsSkip,
    variables: draftsVariables,
  } = useEventsQueryVariables(EVENTS_PAGE_TABS.DRAFTS, user);
  const { data: draftEventsData } = useEventsQuery({
    skip: draftsSkip,
    variables: draftsVariables,
  });

  const tabOptions = [
    {
      label: t('eventsPage.tabs.waitingApproval', {
        count: waitingApprovalEventsData?.events?.meta.count || 0,
      }),
      value: EVENTS_PAGE_TABS.WAITING_APPROVAL,
    },
    {
      label: t('eventsPage.tabs.published', {
        count: publishedEventsData?.events?.meta.count || 0,
      }),
      value: EVENTS_PAGE_TABS.PUBLISHED,
    },
    {
      label: t('eventsPage.tabs.drafts', {
        count: draftEventsData?.events?.meta.count || 0,
      }),
      value: EVENTS_PAGE_TABS.DRAFTS,
    },
  ];

  const goToCreateEvent = () => {
    clearEventFormData();
    history.push(`/${locale}${ROUTES.CREATE_EVENT}`);
  };

  const handleChangeTab = (newTab: string) => {
    setActiveTab(newTab as EVENTS_PAGE_TABS);
    history.push({
      pathname: location.pathname,
      search: replaceParamsToEventQueryString(location.search, { page: null }),
    });
  };

  return (
    <PageWrapper
      backgroundColor="gray"
      className={styles.eventsPage}
      title="eventsPage.pageTitle"
    >
      <MainContent className={styles.mainContent}>
        <Container withOffset={true}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{t('eventsPage.title')}</h1>
            <div className={styles.addButtonWrapper}>
              <Button
                className={styles.addButton}
                fullWidth={true}
                iconLeft={<IconPlus />}
                onClick={goToCreateEvent}
                variant="secondary"
              >
                {t('common.buttonAddEvent')}
              </Button>
            </div>
          </div>

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
            [EVENTS_PAGE_TABS.PUBLISHED]: publishedSkip,
            [EVENTS_PAGE_TABS.WAITING_APPROVAL]: waitingApprovalSkip,
          };
          const variables = {
            [EVENTS_PAGE_TABS.DRAFTS]: draftsVariables,
            [EVENTS_PAGE_TABS.PUBLISHED]: publishedVariables,
            [EVENTS_PAGE_TABS.WAITING_APPROVAL]: waitingApprovalVariables,
          };

          const isActive = activeTab === tab;

          return (
            <TabPanel
              key={index}
              className={styles.tabPanel}
              isActive={isActive}
              index={index}
              name="event-list"
            >
              <SearchPanel />
              <Container withOffset={true}>
                <FilterSummary className={styles.filterSummary} />
              </Container>

              <EventList
                activeTab={activeTab}
                baseVariables={variables[tab]}
                className={styles.eventList}
                listType={listType}
                setListType={setListType}
                skip={skip[tab]}
              />
            </TabPanel>
          );
        })}
      </MainContent>
    </PageWrapper>
  );
};

const EventsPageWrapper: React.FC = () => {
  const { loading: loadingUser, user } = useUser();

  return (
    <LoadingSpinner isLoading={loadingUser}>
      {user ? <EventsPage user={user} /> : <NotSigned />}
    </LoadingSpinner>
  );
};

export default EventsPageWrapper;
