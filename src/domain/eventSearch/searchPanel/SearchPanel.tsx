import { css } from '@emotion/css';
import classNames from 'classnames';
import { IconCalendar, IconHeart, IconLocation, Koros } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import MultiSelectDropdown from '../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import { OptionType } from '../../../types';
import skipFalsyType from '../../../utils/skipFalsyType';
import Container from '../../app/layout/Container';
import { useTheme } from '../../app/theme/Theme';
import { EVENT_TYPE } from '../../event/constants';
import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import {
  getEventSearchInitialValues,
  getEventSearchQuery,
} from '../../eventSearch/utils';
import FilterSummary from '../filterSummary/FilterSummary';
import DateSelectorDropdown, {
  DATE_FIELDS,
} from './dateSelectorDropdown/DateSelectorDropdown';
import PlaceSelector from './placeSelector/PlaceSelector';
import styles from './searchPanel.module.scss';

export const testIds = {
  searchPanel: 'event-search-panel',
};

type SearchState = {
  end: Date | null;
  place: string[];
  start: Date | null;
  text: string;
  type: EVENT_TYPE[];
};

const SearchPanel: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const locale = useLocale();

  const eventTypeOptions = useEventTypeOptions();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    end: null,
    place: [],
    start: null,
    text: '',
    type: [],
  });

  const handleSearch = () => {
    history.push({
      pathname: `/${locale}${ROUTES.SEARCH}`,
      search: getEventSearchQuery(searchState, location.search),
    });
  };

  const handleChangePlaces = (newPlaces: OptionType[]) => {
    setSearchState({ place: newPlaces.map((item) => item.value) });
  };

  const handleChangeEventTypes = (newTypes: OptionType[]) => {
    setSearchState({
      type: newTypes.map((type) => type.value) as EVENT_TYPE[],
    });
  };

  const handleChangeText = (text: string) => {
    setSearchState({ text });
  };

  const handleChangeDate = (field: DATE_FIELDS, value: Date | null) => {
    switch (field) {
      case DATE_FIELDS.END_DATE:
        setSearchState({ end: value });
        break;
      case DATE_FIELDS.START_DATE:
        setSearchState({ start: value });
        break;
    }
  };

  React.useEffect(() => {
    const { end, places, start, text, types } = getEventSearchInitialValues(
      location.search
    );
    setSearchState({ end, place: places, start, text, type: types });
  }, [location.search, setSearchState]);

  return (
    <div
      data-testid={testIds.searchPanel}
      className={classNames(styles.searchPanel, css(theme.searchPanel))}
    >
      <section className={styles.searchPanelWrapper}>
        <Container withOffset={true}>
          <div className={styles.searchRow}>
            <div className={styles.inputWrapper}>
              <SearchInput
                className={styles.searchInput}
                label={t('eventSearchPage.searchPanel.labelSearch')}
                onSearch={handleSearch}
                placeholder={t('eventSearchPage.searchPanel.placeholderSearch')}
                searchButtonAriaLabel={t(
                  'eventSearchPage.searchPanel.buttonSearch'
                )}
                setValue={handleChangeText}
                value={searchState.text}
              />
              <div className={styles.advancedFilters}>
                <div>
                  <DateSelectorDropdown
                    icon={<IconCalendar aria-hidden={true} />}
                    onChangeDate={handleChangeDate}
                    value={{
                      endDate: searchState.end,
                      startDate: searchState.start,
                    }}
                  />
                </div>
                <div>
                  <PlaceSelector
                    icon={<IconLocation />}
                    onChange={handleChangePlaces}
                    toggleButtonLabel={t(
                      'eventSearchPage.searchPanel.labelPlace'
                    )}
                    value={searchState.place}
                  />
                </div>
                <div>
                  <MultiSelectDropdown
                    icon={<IconHeart />}
                    onChange={handleChangeEventTypes}
                    options={eventTypeOptions}
                    showSearch={true}
                    toggleButtonLabel={t(
                      'eventSearchPage.searchPanel.labelEventType'
                    )}
                    value={
                      searchState.type
                        .filter(skipFalsyType)
                        .map((type) =>
                          eventTypeOptions.find((item) => item.value === type)
                        ) as OptionType[]
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <Button
                className={styles.button}
                fullWidth={true}
                onClick={handleSearch}
                variant="success"
              >
                {t('eventSearchPage.searchPanel.buttonSearch')}
              </Button>
            </div>
          </div>
          <FilterSummary />
        </Container>
      </section>
      <Koros flipHorizontal={true} className={styles.koros} type="basic" />
    </div>
  );
};

export default SearchPanel;
