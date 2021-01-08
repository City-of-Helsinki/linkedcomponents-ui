import classNames from 'classnames';
import { css } from 'emotion';
import { IconAngleLeft, IconAngleRight } from 'hds-react';
import range from 'lodash/range';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './pagination.module.scss';

export interface PaginationProps {
  pageCount: number;
  selectedPage: number;
  pageNeighbours?: number;
  setSelectedPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  selectedPage,
  pageNeighbours = 1,
  setSelectedPage,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isNextDisabled: boolean = selectedPage >= pageCount;
  const isPreviousDisabled: boolean = selectedPage <= 1;

  const getPageNumbers = (): Array<number | null> => {
    // the total page numbers to show on the control
    const totalPageItems = pageNeighbours * 2 + 3;
    // Total pagination items which also includes previous and next controls
    const totalPaginationItems = totalPageItems + 2;

    if (pageCount > totalPaginationItems) {
      const startPage = Math.max(2, selectedPage - pageNeighbours);
      const endPage = Math.min(pageCount - 1, selectedPage + pageNeighbours);
      let pages: Array<number | null> = range(startPage, endPage + 1);

      const hasLeftHiddenPages = startPage > 2;
      const hasRightHiddenPages = pageCount - endPage > 1;
      const hiddenOffset = totalPageItems - (pages.length + 1);

      if (!hasLeftHiddenPages && hasRightHiddenPages) {
        // handle: (1) {2} [3] {4 5} ... (10)
        const extraPages = range(endPage + 1, endPage + hiddenOffset + 1);
        pages = [...pages, ...extraPages, null];
      } else if (hasLeftHiddenPages && !hasRightHiddenPages) {
        // handle: (1) ... {6 7} [8] {9} (10)
        const extraPages = range(startPage - hiddenOffset, startPage);
        pages = [null, ...extraPages, ...pages];
      } else {
        // handle: (1) ... {5} [6] {7} ... (10)
        pages = [null, ...pages, null];
      }

      return [1, ...pages, pageCount];
    }

    return range(1, pageCount + 1);
  };

  const handlePreviousClick = () => {
    if (!isPreviousDisabled) {
      setSelectedPage(selectedPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!isNextDisabled) {
      setSelectedPage(selectedPage + 1);
    }
  };

  return (
    <nav aria-label={t('common.pagination.navigation')}>
      <ul className={classNames(styles.pagination, css(theme.pagination))}>
        <li className={styles.pageItem}>
          <button
            aria-label={t('common.pagination.previous')}
            className={styles.pageLink}
            disabled={isPreviousDisabled}
            onClick={handlePreviousClick}
          >
            <IconAngleLeft />
          </button>
        </li>
        {getPageNumbers().map((page, index) => {
          return (
            <li
              key={page ? page : `break_${index}`}
              className={styles.pageItem}
            >
              <button
                aria-label={
                  page ? t('common.pagination.page', { page }) : undefined
                }
                className={classNames(styles.pageLink, {
                  [styles.selected]: selectedPage === page,
                })}
                disabled={!page}
                onClick={() => {
                  if (page) {
                    setSelectedPage(page);
                  }
                }}
              >
                {page || '...'}
              </button>
            </li>
          );
        })}
        <li className={styles.pageItem}>
          <button
            aria-label={t('common.pagination.next')}
            className={styles.pageLink}
            disabled={isNextDisabled}
            onClick={handleNextClick}
          >
            <IconAngleRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
