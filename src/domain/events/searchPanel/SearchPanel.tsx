import { IconBell, IconGroup, IconHeart } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SearchRow } from '../../../common/components/searchPanel/SearchPanel';
import { ROUTES } from '../../../constants';
import { EventStatus } from '../../../generated/graphql';
import useEventSearchHelpers from '../../../hooks/useEventSearchHelpers';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import Container from '../../app/layout/container/Container';
import { EVENT_TYPE } from '../../event/constants';
import EventStatusSelector from '../../eventSearch/searchPanel/eventStatusSelector/EventStatusSelector';
import PublisherSelector from '../../eventSearch/searchPanel/publisherSelector/PublisherSelector';
import TypeSelector from '../../eventSearch/searchPanel/typeSelector/TypeSelector';
import FilterSummary from '../filterSummary/FilterSummary';
import { getEventSearchInitialValues, getEventSearchQuery } from '../utils';
import styles from './searchPanel.module.scss';

type SearchState = {
  eventStatus: EventStatus[];
  publisher: string[];
  type: EVENT_TYPE[];
  x_full_text: string;
};

const SearchPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    eventStatus: [],
    publisher: [],
    type: [],
    x_full_text: '',
  });

  const {
    handleChangeEventStatuses,
    handleChangePublishers,
    handleChangeText,
    handleChangeTypes,
  } = useEventSearchHelpers(setSearchState);

  const handleSearch = () => {
    navigate({
      pathname: `/${locale}${ROUTES.EVENTS}`,
      search: getEventSearchQuery(searchState, location.search),
    });
  };

  React.useEffect(() => {
    const { eventStatus, publisher, fullText, types } =
      getEventSearchInitialValues(location.search);
    setSearchState({
      eventStatus,
      publisher,
      x_full_text: fullText,
      type: types,
    });
  }, [locale, location.search, setSearchState]);

  return (
    <div className={styles.searchPanel}>
      <Container withOffset={true}>
        <SearchRow
          onSearch={handleSearch}
          onSearchValueChange={handleChangeText}
          searchButtonAriaLabel={t('eventSearchPage.searchPanel.buttonSearch')}
          searchButtonText={t('eventSearchPage.searchPanel.buttonSearch')}
          searchInputClassName={styles.searchInput}
          searchInputLabel={t('eventSearchPage.searchPanel.labelSearch')}
          searchInputPlaceholder={t(
            'eventSearchPage.searchPanel.placeholderSearch'
          )}
          searchInputValue={searchState.x_full_text}
          selectors={[
            <TypeSelector
              key="event-type"
              icon={<IconHeart aria-hidden />}
              onChange={handleChangeTypes}
              toggleButtonLabel={t(
                'eventSearchPage.searchPanel.labelEventType'
              )}
              value={searchState.type}
            />,
            <PublisherSelector
              key="publisher"
              icon={<IconGroup aria-hidden />}
              onChange={handleChangePublishers}
              toggleButtonLabel={t(
                'eventSearchPage.searchPanel.labelPublisher'
              )}
              value={searchState.publisher}
            />,
            <EventStatusSelector
              key="event-status"
              icon={<IconBell area-hidden />}
              onChange={handleChangeEventStatuses}
              toggleButtonLabel={t(
                'eventSearchPage.searchPanel.labelEventStatus'
              )}
              value={searchState.eventStatus}
            />,
          ]}
        />
        <FilterSummary className={styles.filterSummary} />
      </Container>
    </div>
  );
};

export default SearchPanel;
