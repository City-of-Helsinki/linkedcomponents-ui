import { css } from '@emotion/css';
import classNames from 'classnames';
import { IconHeart, IconSearch } from 'hds-react';
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
import { useTheme } from '../../app/theme/Theme';
import { EVENT_TYPE } from '../../event/constants';
import useEventTypeOptions from '../../event/hooks/useEventTypeOptions';
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
  const history = useHistory();
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
    history.push({
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
    <div
      className={classNames(
        styles.searchPanel,
        css(theme.registrationSearchPanel)
      )}
    >
      <div className={styles.inputRow}>
        <div className={styles.typeSelectorWrapper}>
          <MultiSelectDropdown
            icon={<IconHeart aria-hidden />}
            onChange={handleChangeEventTypes}
            options={eventTypeOptions}
            showSearch={true}
            toggleButtonLabel={t(
              'registrationsPage.searchPanel.labelEventType'
            )}
            value={searchState.eventType
              .map(
                (type) =>
                  eventTypeOptions.find(
                    (item) => item.value === type
                  ) as OptionType
              )
              .filter(skipFalsyType)}
          />
        </div>
        <div className={styles.searchInputWrapper}>
          <SearchInput
            className={styles.searchInput}
            clearButtonAriaLabel={t(
              'registrationsPage.searchPanel.buttonClear'
            )}
            hideLabel={true}
            label={t('registrationsPage.searchPanel.labelSearch')}
            onSearch={handleSearch}
            placeholder={t('registrationsPage.searchPanel.placeholderSearch')}
            searchButtonAriaLabel={t(
              'registrationsPage.searchPanel.buttonSearch'
            )}
            setValue={handleChangeText}
            value={searchState.text}
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.button}
            fullWidth={true}
            iconLeft={<IconSearch aria-hidden />}
            onClick={handleSearch}
            variant="success"
          >
            {t('registrationsPage.searchPanel.buttonSearch')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
