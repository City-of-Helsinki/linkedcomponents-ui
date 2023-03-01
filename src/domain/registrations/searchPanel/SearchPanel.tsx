import { ClassNames } from '@emotion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SearchRow } from '../../../common/components/searchPanel/SearchPanel';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import { OptionType } from '../../../types';
import { useTheme } from '../../app/theme/Theme';
import { EVENT_TYPE } from '../../event/constants';
import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import EventTypeSelector from '../../events/searchPanel/eventTypeSelector/EventTypeSelector';
import {
  getRegistrationSearchInitialValues,
  getRegistrationSearchQuery,
} from '../utils';
import styles from './searchPanel.module.scss';

type SearchState = {
  eventType: EVENT_TYPE[];
  text: string;
};

const SearchPanel: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();

  const eventTypeOptions = useEventTypeOptions();

  const [searchState, setSearchState] = useSearchState<SearchState>({
    eventType: [],
    text: '',
  });

  const handleChangeEventTypes = (newTypes: OptionType[]) => {
    setSearchState({
      eventType: newTypes.map((type) => type.value) as EVENT_TYPE[],
    });
  };

  const handleChangeText = (text: string) => {
    setSearchState({ text });
  };

  const handleSearch = () => {
    navigate({
      pathname: `/${locale}${ROUTES.REGISTRATIONS}`,
      search: getRegistrationSearchQuery(searchState, location.search),
    });
  };

  React.useEffect(() => {
    const { eventType, text } = getRegistrationSearchInitialValues(
      location.search
    );
    setSearchState({ eventType, text });
  }, [location.search, setSearchState]);

  return (
    <ClassNames>
      {({ css, cx }) => (
        <div
          className={cx(styles.searchPanel, css(theme.registrationSearchPanel))}
        >
          <SearchRow
            onSearch={handleSearch}
            onSearchValueChange={handleChangeText}
            searchButtonAriaLabel={t(
              'registrationsPage.searchPanel.buttonSearch'
            )}
            searchButtonText={t('registrationsPage.searchPanel.buttonSearch')}
            searchInputClassName={styles.searchInput}
            searchInputLabel={t('registrationsPage.searchPanel.labelSearch')}
            searchInputPlaceholder={t(
              'registrationsPage.searchPanel.placeholderSearch'
            )}
            searchInputValue={searchState.text}
            selector={
              <EventTypeSelector
                onChange={handleChangeEventTypes}
                options={eventTypeOptions}
                toggleButtonLabel={t(
                  'registrationsPage.searchPanel.labelEventType'
                )}
                value={searchState.eventType}
              />
            }
          />
        </div>
      )}
    </ClassNames>
  );
};

export default SearchPanel;
