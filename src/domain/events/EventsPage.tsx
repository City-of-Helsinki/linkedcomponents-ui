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
import NotSigned from '../notSigned/NotSigned';
import useUser from '../user/hooks/useUser';
import { getUserFields } from '../user/utils';
import { setEventListOptions } from './actions';
import {
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_TABS,
} from './constants';
import EventList from './eventList/EventList';
import styles from './events.module.scss';
import SearchPanel from './searchPanel/SearchPanel';
import {
  eventListSortSelector,
  eventListTabSelector,
  eventListTypeSelector,
} from './selectors';
import { getEventsQuerySkip, getEventsQueryVariables } from './utils';

interface Props {
  user: UserFieldsFragment;
}

const EventsPage: React.FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const activeTab = useSelector(eventListTabSelector);
  const listType = useSelector(eventListTypeSelector);
  const sort = useSelector(eventListSortSelector);

  const setActiveTab = async (selectedTab: EVENTS_PAGE_TABS) => {
    dispatch(setEventListOptions({ tab: selectedTab }));
  };

  const setListType = (selectedListType: EVENT_LIST_TYPES) => {
    dispatch(setEventListOptions({ listType: selectedListType }));
  };

  const setSort = (selectedSort: EVENT_SORT_OPTIONS) => {
    dispatch(setEventListOptions({ sort: selectedSort }));
  };

  const locale = useLocale();
  const history = useHistory();
  const { t } = useTranslation();
  const { adminOrganizations } = getUserFields(user);
  const { data: waitingApprovalEventsData } = useEventsQuery({
    skip: getEventsQuerySkip(
      EVENTS_PAGE_TABS.WAITING_APPROVAL,
      adminOrganizations
    ),
    variables: getEventsQueryVariables({
      adminOrganizations,
      tab: EVENTS_PAGE_TABS.WAITING_APPROVAL,
    }),
  });
  const { data: publishedEventsData } = useEventsQuery({
    skip: getEventsQuerySkip(EVENTS_PAGE_TABS.PUBLISHED, adminOrganizations),
    variables: getEventsQueryVariables({
      adminOrganizations,
      tab: EVENTS_PAGE_TABS.PUBLISHED,
    }),
  });
  const { data: draftEventsData } = useEventsQuery({
    skip: getEventsQuerySkip(EVENTS_PAGE_TABS.DRAFTS, adminOrganizations),
    variables: getEventsQueryVariables({
      adminOrganizations,
      tab: EVENTS_PAGE_TABS.DRAFTS,
    }),
  });

  const tabOptions = [
    {
      label: t('eventsPage.tabs.waitingApproval', {
        count: waitingApprovalEventsData?.events.meta.count || 0,
      }),
      value: EVENTS_PAGE_TABS.WAITING_APPROVAL,
    },
    {
      label: t('eventsPage.tabs.published', {
        count: publishedEventsData?.events.meta.count || 0,
      }),
      value: EVENTS_PAGE_TABS.PUBLISHED,
    },
    {
      label: t('eventsPage.tabs.drafts', {
        count: draftEventsData?.events.meta.count || 0,
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
  };

  return (
    <PageWrapper backgroundColor="gray" title="eventsPage.pageTitle">
      <MainContent>
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
          const isActive = activeTab === tab;
          return (
            <TabPanel
              key={index}
              isActive={isActive}
              index={index}
              name="event-list"
            >
              <SearchPanel />
              <EventList
                activeTab={activeTab}
                baseVariables={getEventsQueryVariables({
                  adminOrganizations,
                  search,
                  tab,
                })}
                listType={listType}
                setListType={setListType}
                setSort={setSort}
                skip={getEventsQuerySkip(tab, adminOrganizations)}
                sort={sort}
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
