import { IconPhoto } from 'hds-react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import Table from '../../../common/components/table/Table2';
import { ImageFieldsFragment, ImagesQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import formatDate from '../../../utils/formatDate';
import getInitialSort from '../../../utils/getInitialSort';
import getNewSort from '../../../utils/getNewSort';
import { getImageFields, getImageItemId } from '../../image/utils';
import { IMAGE_SORT_OPTIONS } from '../constants';
import ImageActionsDropdown from '../imageActionsDropdown/ImageActionsDropdown';
import styles from './imagesTable.module.scss';

export interface ImagesTableProps {
  caption: string;
  className?: string;
  images: ImagesQuery['images']['data'];
  setSort: (sort: IMAGE_SORT_OPTIONS) => void;
  sort: IMAGE_SORT_OPTIONS;
}

type ColumnProps = {
  image: ImageFieldsFragment;
};

const ImageColumn: FC<ColumnProps> = ({ image }) => {
  const locale = useLocale();
  const { url } = getImageFields(image, locale);

  return (
    <div className={styles.imagePreview}>
      {url ? (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${url})` }}
        />
      ) : (
        /* istanbul ignore next */
        <div className={styles.placeholderImage}>
          <IconPhoto size="xl" />
        </div>
      )}
    </div>
  );
};

const IdColumn: FC<ColumnProps> = ({ image }) => {
  const locale = useLocale();
  const { imageUrl, id } = getImageFields(image, locale);

  return (
    <Link
      onClick={/* istanbul ignore next */ (e) => e.preventDefault()}
      to={imageUrl}
    >
      {id}
    </Link>
  );
};

const NameColumn: FC<ColumnProps> = ({ image }) => {
  const locale = useLocale();
  const { name } = getImageFields(image, locale);

  return <>{name}</>;
};

const LastModifiedTimeColumn: FC<ColumnProps> = ({ image }) => {
  const locale = useLocale();
  const { lastModifiedTime } = getImageFields(image, locale);

  return <>{formatDate(lastModifiedTime)}</>;
};

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
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const handleRowClick = (image: object) => {
    const { imageUrl } = getImageFields(image as ImageFieldsFragment, locale);

    navigate({
      pathname: imageUrl,
      search: queryStringWithReturnPath,
    });
  };

  const handleSortChange = (key: string) => {
    setSort(key as IMAGE_SORT_OPTIONS);
  };

  return (
    <Table
      caption={caption}
      className={className}
      cols={[
        {
          className: styles.imageColumn,
          key: 'image',
          headerName: t('imagesPage.imagesTableColumns.image'),
          transform: (image: ImageFieldsFragment) => (
            <ImageColumn image={image} />
          ),
        },
        {
          className: styles.idColumn,
          key: 'id',
          headerName: t('imagesPage.imagesTableColumns.id'),
          transform: (image: ImageFieldsFragment) => <IdColumn image={image} />,
        },
        {
          className: styles.nameColumn,
          key: 'name',
          headerName: t('imagesPage.imagesTableColumns.name'),
          transform: (image: ImageFieldsFragment) => (
            <NameColumn image={image} />
          ),
        },
        {
          className: styles.lastModifiedTimeColumn,
          isSortable: true,
          key: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME,
          headerName: t('imagesPage.imagesTableColumns.lastModifiedTime'),
          sortIconType: 'other',
          transform: (image: ImageFieldsFragment) => (
            <LastModifiedTimeColumn image={image} />
          ),
        },
        {
          className: styles.actionButtonsColumn,
          key: 'actionButtons',
          headerName: '',
          onClick: (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
          },
          transform: (image: ImageFieldsFragment) => (
            <ImageActionsDropdown image={image} />
          ),
        },
      ]}
      {...getInitialSort(sort)}
      getRowProps={(image) => {
        const { id, name } = getImageFields(
          image as ImageFieldsFragment,
          locale
        );

        return {
          'aria-label': name,
          'data-testid': id,
          id: getImageItemId(id),
        };
      }}
      indexKey="id"
      onRowClick={handleRowClick}
      onSort={(order, colKey, handleSort) => {
        handleSortChange(getNewSort({ order, colKey }));
        handleSort();
      }}
      rows={images as ImageFieldsFragment[]}
      variant="light"
    />
  );
};

export default ImagesTable;
