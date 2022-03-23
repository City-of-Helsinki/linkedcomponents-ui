import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { OrganizationFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import formatDate from '../../../../utils/formatDate';
import {
  addParamsToOrganizationQueryString,
  getOrganizationItemId,
} from '../../../organizations/utils';
import { getOrganizationFields } from '../../utils';
import styles from './subOrganizationTable.module.scss';

interface SubOrganizationTableRowProps {
  organization: OrganizationFieldsFragment;
}
const SubOrganizationTableRow: React.FC<SubOrganizationTableRowProps> = ({
  organization,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const locale = useLocale();
  const {
    classification,
    dataSource,
    foundingDate,
    fullName,
    id,
    organizationUrl,
    originId,
  } = getOrganizationFields(organization, locale, t);

  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const goToEditOrganizationPage = () => {
    const queryString = addParamsToOrganizationQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: organizationUrl,
      search: queryString,
    });
  };

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (ev.target instanceof Node && rowRef.current?.contains(ev.target)) {
      goToEditOrganizationPage();
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter') {
      goToEditOrganizationPage();
    }
  };
  return (
    <tr
      ref={rowRef}
      role="button"
      aria-label={fullName}
      id={getOrganizationItemId(id)}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <td className={styles.nameColumn}>{fullName}</td>
      <td className={styles.foundingColumn}>
        {foundingDate
          ? formatDate(foundingDate)
          : /* istanbul ignore next */ '-'}
      </td>
      <td className={styles.classificationColumn}>
        {classification ?? /* istanbul ignore next */ '-'}
      </td>
      <td className={styles.dataSourceColumn}>
        {dataSource ?? /* istanbul ignore next */ '-'}
      </td>
      <td className={styles.originIdColumn}>
        {originId ?? /* istanbul ignore next */ '-'}
      </td>
    </tr>
  );
};

export default SubOrganizationTableRow;
