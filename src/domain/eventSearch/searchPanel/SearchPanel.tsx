import classNames from 'classnames';
import { css } from 'emotion';
import { Koros } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Container from '../../app/layout/Container';
import FormContainer from '../../app/layout/FormContainer';
import { useTheme } from '../../app/theme/Theme';
import {
  getEventSearchInitialValues,
  getEventSearchQuery,
} from '../../eventSearch/utils';
import styles from './searchPanel.module.scss';

const SearchPanel: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const locale = useLocale();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (text: string) => {
    history.push({
      pathname: `/${locale}${ROUTES.SEARCH}`,
      search: getEventSearchQuery({ text }),
    });
  };

  React.useEffect(() => {
    const { text } = getEventSearchInitialValues(location.search);
    setSearchValue(text);
  }, [location.search]);

  return (
    <div
      className={classNames(styles.searchPanel, css(theme.eventSearchPanel))}
    >
      <section className={styles.searchPanelWrapper}>
        <Container>
          <FormContainer>
            <div className={styles.searchRow}>
              <div className={styles.inputWrapper}>
                <SearchInput
                  className={styles.searchInput}
                  clearButtonAriaLabel={t(
                    'eventSearchPage.searchPanel.buttonClear'
                  )}
                  label={t('eventSearchPage.searchPanel.labelSearch')}
                  onSearch={handleSearch}
                  placeholder={t(
                    'eventSearchPage.searchPanel.placeholderSearch'
                  )}
                  searchButtonAriaLabel={t(
                    'eventSearchPage.searchPanel.buttonSearch'
                  )}
                  setValue={setSearchValue}
                  value={searchValue}
                />
              </div>
              <div className={styles.buttonWrapper}>
                <Button
                  fullWidth={true}
                  onClick={() => handleSearch(searchValue)}
                  variant="success"
                >
                  {t('eventSearchPage.searchPanel.buttonSearch')}
                </Button>
              </div>
            </div>
          </FormContainer>
        </Container>
      </section>
      <Koros flipHorizontal={true} className={styles.koros} type="basic" />
    </div>
  );
};

export default SearchPanel;
