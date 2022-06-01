import { css } from '@emotion/css';
import { IconHeart, IconSearch } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

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
import { getEventSearchInitialValues, getEventSearchQuery } from '../utils';
import styles from './searchPanel.module.scss';

type SearchState = {
  text: string;
  type: EVENT_TYPE[];
};

const SearchPanel: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
      <Container className={css(theme.eventSearchPanel)} withOffset={true}>
        <div className={styles.inputRow}>
          <div className={styles.typeSelectorWrapper}>
            <MultiSelectDropdown
              icon={<IconHeart aria-hidden />}
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
          <div className={styles.searchInputWrapper}>
            <SearchInput
              className={styles.searchInput}
              hideLabel={true}
              label={t('eventSearchPage.searchPanel.labelSearch')}
              onSearch={handleSearch}
              placeholder={t('eventSearchPage.searchPanel.placeholderSearch')}
              searchButtonAriaLabel={t(
                'eventSearchPage.searchPanel.buttonSearch'
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
              variant="secondary"
            >
              {t('eventSearchPage.searchPanel.buttonSearch')}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SearchPanel;
