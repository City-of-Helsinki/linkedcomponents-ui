import { ClassNames } from '@emotion/react';
import {
  IconCalendar,
  IconGroup,
  IconHeart,
  IconLocation,
  Koros,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import Breadcrumb from '../../../common/components/breadcrumb/Breadcrumb';
import Button from '../../../common/components/button/Button';
import DateSelectorDropdown from '../../../common/components/dateSelectorDropdown/DateSelectorDropdown';
import MultiSelectDropdown from '../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { ROUTES, testIds } from '../../../constants';
import useEventSearchHelpers from '../../../hooks/useEventSearchHelpers';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import Container from '../../app/layout/container/Container';
import TitleRow from '../../app/layout/titleRow/TitleRow';
import { useTheme } from '../../app/theme/Theme';
import { EVENT_TYPE } from '../../event/constants';
import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import FilterSummary from '../../events/filterSummary/FilterSummary';
import {
  getEventSearchInitialValues,
  getEventSearchQuery,
} from '../../events/utils';
import PlaceSelector from './placeSelector/PlaceSelector';
import PublisherSelector from './publisherSelector/PublisherSelector';
import styles from './searchPanel.module.scss';

type SearchState = {
  end: Date | null;
  place: string[];
  publisher: string[];
  start: Date | null;
  text: string;
  type: EVENT_TYPE[];
};

const SearchPanel: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();

  const eventTypeOptions = useEventTypeOptions();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    end: null,
    place: [],
    publisher: [],
    start: null,
    text: '',
    type: [],
  });

  const {
    handleChangeDate,
    handleChangePlaces,
    handleChangePublishers,
    handleChangeText,
    handleChangeTypes,
  } = useEventSearchHelpers(setSearchState);

  const handleSearch = () => {
    navigate({
      pathname: `/${locale}${ROUTES.SEARCH}`,
      search: getEventSearchQuery(searchState, location.search),
    });
  };

  React.useEffect(() => {
    const { end, places, publisher, start, text, types } =
      getEventSearchInitialValues(location.search);
    setSearchState({ end, place: places, publisher, start, text, type: types });
  }, [location.search, setSearchState]);

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          data-testid={testIds.eventSearchPanel.searchPanel}
          className={cx(styles.searchPanel, css(theme.searchPanel))}
        >
          <section className={styles.searchPanelWrapper}>
            <Container withOffset={true}>
              <TitleRow
                breadcrumbClassName={styles.titleRow}
                breadcrumb={
                  <Breadcrumb
                    list={[
                      { title: t('common.home'), path: ROUTES.HOME },
                      { title: t(`eventSearchPage.pageTitle`), path: null },
                    ]}
                  />
                }
                title={t('eventSearchPage.pageTitle')}
                titleClassName={styles.titleRow}
              />
              <div className={styles.searchRow}>
                <div className={styles.inputWrapper}>
                  <SearchInput
                    className={styles.searchInput}
                    label={t('eventSearchPage.searchPanel.labelSearch')}
                    onChange={handleChangeText}
                    onSubmit={handleSearch}
                    placeholder={getValue(
                      t('eventSearchPage.searchPanel.placeholderSearch'),
                      undefined
                    )}
                    searchButtonAriaLabel={getValue(
                      t('eventSearchPage.searchPanel.buttonSearch'),
                      undefined
                    )}
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
                        onChange={handleChangeTypes}
                        options={eventTypeOptions}
                        showSearch={true}
                        toggleButtonLabel={t(
                          'eventSearchPage.searchPanel.labelEventType'
                        )}
                        value={
                          searchState.type
                            .filter(skipFalsyType)
                            .map((type) =>
                              eventTypeOptions.find(
                                (item) => item.value === type
                              )
                            ) as OptionType[]
                        }
                      />
                    </div>
                    <div>
                      <PublisherSelector
                        icon={<IconGroup aria-hidden />}
                        onChange={handleChangePublishers}
                        toggleButtonLabel={t(
                          'eventSearchPage.searchPanel.labelPublisher'
                        )}
                        value={searchState.publisher}
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
          <Koros flipVertical className={styles.koros} type="basic" />
        </div>
      )}
    </ClassNames>
  );
};

export default SearchPanel;
