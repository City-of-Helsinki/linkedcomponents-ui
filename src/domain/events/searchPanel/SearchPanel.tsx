import { IconGroup } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SearchRow } from '../../../common/components/searchPanel/SearchPanel';
import { ROUTES } from '../../../constants';
import useEventSearchHelpers from '../../../hooks/useEventSearchHelpers';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import Container from '../../app/layout/container/Container';
import { EVENT_TYPE } from '../../event/constants';
import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import PublisherSelector from '../../eventSearch/searchPanel/publisherSelector/PublisherSelector';
import FilterSummary from '../filterSummary/FilterSummary';
import { getEventSearchInitialValues, getEventSearchQuery } from '../utils';
import EventTypeSelector from './eventTypeSelector/EventTypeSelector';
import styles from './searchPanel.module.scss';

type SearchState = {
  publisher: string[];
  text: string;
  type: EVENT_TYPE[];
};

const SearchPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();

  const eventTypeOptions = useEventTypeOptions();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    publisher: [],
    text: '',
    type: [],
  });

  const { handleChangePublishers, handleChangeText, handleChangeTypes } =
    useEventSearchHelpers(setSearchState);

  const handleSearch = () => {
    navigate({
      pathname: `/${locale}${ROUTES.EVENTS}`,
      search: getEventSearchQuery(searchState, location.search),
    });
  };

  React.useEffect(() => {
    const { publisher, text, types } = getEventSearchInitialValues(
      location.search
    );
    setSearchState({ publisher, text, type: types });
  }, [location.search, setSearchState]);

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
          searchInputValue={searchState.text}
          selectors={[
            <EventTypeSelector
              key="event-type"
              onChange={handleChangeTypes}
              options={eventTypeOptions}
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
          ]}
        />
        <FilterSummary className={styles.filterSummary} />
      </Container>
    </div>
  );
};

export default SearchPanel;
