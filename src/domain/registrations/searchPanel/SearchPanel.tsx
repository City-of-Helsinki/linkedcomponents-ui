import { ClassNames } from '@emotion/react';
import { IconGroup } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { SearchRow } from '../../../common/components/searchPanel/SearchPanel';
import { ROUTES } from '../../../constants';
import useEventSearchHelpers from '../../../hooks/useEventSearchHelpers';
import useLocale from '../../../hooks/useLocale';
import useSearchState from '../../../hooks/useSearchState';
import { useTheme } from '../../app/theme/Theme';
import { EVENT_TYPE } from '../../event/constants';
import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
import EventTypeSelector from '../../events/searchPanel/eventTypeSelector/EventTypeSelector';
import PublisherSelector from '../../eventSearch/searchPanel/publisherSelector/PublisherSelector';
import {
  getRegistrationSearchInitialValues,
  getRegistrationSearchQuery,
} from '../utils';
import styles from './searchPanel.module.scss';

type SearchState = {
  eventType: EVENT_TYPE[];
  publisher: string[];
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
    publisher: [],
    text: '',
  });

  const { handleChangeEventTypes, handleChangePublishers, handleChangeText } =
    useEventSearchHelpers(setSearchState);

  const handleSearch = () => {
    navigate({
      pathname: `/${locale}${ROUTES.REGISTRATIONS}`,
      search: getRegistrationSearchQuery(searchState, location.search),
    });
  };

  React.useEffect(() => {
    const { eventType, publisher, text } = getRegistrationSearchInitialValues(
      location.search
    );
    setSearchState({ eventType, publisher, text });
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
            selectors={[
              <EventTypeSelector
                key="event-type"
                onChange={handleChangeEventTypes}
                options={eventTypeOptions}
                toggleButtonLabel={t(
                  'registrationsPage.searchPanel.labelEventType'
                )}
                value={searchState.eventType}
              />,
              <PublisherSelector
                key="publisher"
                icon={<IconGroup aria-hidden />}
                onChange={handleChangePublishers}
                toggleButtonLabel={t(
                  'registrationsPage.searchPanel.labelPublisher'
                )}
                value={searchState.publisher}
              />,
            ]}
          />
        </div>
      )}
    </ClassNames>
  );
};

export default SearchPanel;
