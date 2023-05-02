import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SearchRow } from '../../../common/components/searchPanel/SearchPanel';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import { OptionType } from '../../../types';
import Container from '../../app/layout/container/Container';
import { EVENT_TYPE } from '../../event/constants';
import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import FilterSummary from '../filterSummary/FilterSummary';
import { getEventSearchInitialValues, getEventSearchQuery } from '../utils';
import EventTypeSelector from './eventTypeSelector/EventTypeSelector';
import styles from './searchPanel.module.scss';

type SearchState = {
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
    text: '',
    type: [],
  });

  const handleChangeEventTypes = (newTypes: OptionType[]) => {
    setSearchState({
      type: newTypes.map((type) => type.value) as EVENT_TYPE[],
    });
  };

  const handleChangeText = (text: string) => {
    setSearchState({ text });
  };

  const handleSearch = () => {
    navigate({
      pathname: `/${locale}${ROUTES.EVENTS}`,
      search: getEventSearchQuery(searchState, location.search),
    });
  };

  React.useEffect(() => {
    const { text, types } = getEventSearchInitialValues(location.search);
    setSearchState({ text, type: types });
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
          selector={
            <EventTypeSelector
              onChange={handleChangeEventTypes}
              options={eventTypeOptions}
              toggleButtonLabel={t(
                'eventSearchPage.searchPanel.labelEventType'
              )}
              value={searchState.type}
            />
          }
        />
        <FilterSummary className={styles.filterSummary} />
      </Container>
    </div>
  );
};

export default SearchPanel;
