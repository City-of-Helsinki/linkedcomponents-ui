import { ClassNames } from '@emotion/react';
import {
  ButtonVariant,
  IconBell,
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
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { ROUTES, testIds } from '../../../constants';
import { EventStatus } from '../../../generated/graphql';
import useEventSearchHelpers from '../../../hooks/useEventSearchHelpers';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import getValue from '../../../utils/getValue';
import Container from '../../app/layout/container/Container';
import TitleRow from '../../app/layout/titleRow/TitleRow';
import { useTheme } from '../../app/theme/Theme';
import { EVENT_TYPE } from '../../event/constants';
import FilterSummary from '../../events/filterSummary/FilterSummary';
import {
  getEventSearchInitialValues,
  getEventSearchQuery,
} from '../../events/utils';
import EventStatusSelector from './eventStatusSelector/EventStatusSelector';
import PlaceSelector from './placeSelector/PlaceSelector';
import PublisherSelector from './publisherSelector/PublisherSelector';
import styles from './searchPanel.module.scss';
import TypeSelector from './typeSelector/TypeSelector';

type SearchState = {
  end: Date | null;
  eventStatus: EventStatus[];
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

  const [searchState, setSearchState] = useSearchState<SearchState>({
    end: null,
    eventStatus: [],
    place: [],
    publisher: [],
    start: null,
    text: '',
    type: [],
  });

  const {
    handleChangeDate,
    handleChangeEventStatuses,
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
    const { end, eventStatus, places, publisher, start, text, types } =
      getEventSearchInitialValues(location.search);
    setSearchState({
      end,
      eventStatus,
      place: places,
      publisher,
      start,
      text,
      type: types,
    });
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
                      <TypeSelector
                        icon={<IconHeart />}
                        onChange={handleChangeTypes}
                        toggleButtonLabel={t(
                          'eventSearchPage.searchPanel.labelEventType'
                        )}
                        value={searchState.type}
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
                    <div>
                      <EventStatusSelector
                        icon={<IconBell aria-hidden />}
                        onChange={handleChangeEventStatuses}
                        toggleButtonLabel={t(
                          'eventSearchPage.searchPanel.labelEventStatus'
                        )}
                        value={searchState.eventStatus}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.buttonWrapper}>
                  <Button
                    className={styles.button}
                    fullWidth={true}
                    onClick={handleSearch}
                    variant={ButtonVariant.Success}
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
