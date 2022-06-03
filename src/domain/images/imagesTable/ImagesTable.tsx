import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import NoDataRow from '../../../common/components/table/noDataRow/NoDataRow';
import SortableColumn from '../../../common/components/table/sortableColumn/SortableColumn';
import Table from '../../../common/components/table/Table';
import { ImageFieldsFragment, ImagesQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useSetFocused from '../../../hooks/useSetFocused';
import { getImageFields } from '../../image/utils';
import { IMAGE_SORT_OPTIONS } from '../constants';
import useImagesQueryStringWithReturnPath from '../hooks/useImagesQueryStringWithReturnPath';
import styles from './imagesTable.module.scss';
import ImagesTableRow from './imagesTableRow/ImagesTableRow';

export interface ImagesTableProps {
  caption: string;
  className?: string;
  images: ImagesQuery['images']['data'];
  setSort: (sort: IMAGE_SORT_OPTIONS) => void;
  sort: IMAGE_SORT_OPTIONS;
}

const ImagesTable: React.FC<ImagesTableProps> = ({
  caption,
  className,
  images,
  setSort,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useImagesQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);
  const { focused } = useSetFocused(table);

  const handleRowClick = (image: ImageFieldsFragment) => {
    const { imageUrl } = getImageFields(image, locale);

    navigate({
      pathname: imageUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSort = (key: string) => {
    setSort(key as IMAGE_SORT_OPTIONS);
  };

  return (
    <Table ref={table} className={className}>
      <caption aria-live={focused ? 'polite' : undefined}>{caption}</caption>
      <thead>
        <tr>
          <th className={styles.imageColumn}>
            {t('imagesPage.imagesTableColumns.image')}
          </th>
          <th className={styles.idColumn}>
            {t('imagesPage.imagesTableColumns.id')}
          </th>
          <th className={styles.nameColumn}>
            {t('imagesPage.imagesTableColumns.name')}
          </th>
          <SortableColumn
            className={styles.nEventsColumn}
            label={t('imagesPage.imagesTableColumns.lastModifiedTime')}
            onClick={handleSort}
            sort={sort}
            sortKey={IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME}
            type="default"
          />

          <th className={styles.actionButtonsColumn}></th>
        </tr>
      </thead>
      <tbody>
        {images.map(
          (image) =>
            image && (
              <ImagesTableRow
                key={image.id}
                image={image}
                onRowClick={handleRowClick}
              />
            )
        )}
        {!images.length && <NoDataRow colSpan={4} />}
      </tbody>
    </Table>
  );
};

export default ImagesTable;
