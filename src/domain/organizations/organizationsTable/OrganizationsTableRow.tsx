import { IconAngleDown, IconAngleUp } from 'hds-react';
import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { scrollToItem } from '../../../utils/scrollToItem';
import { getOrganizationFields } from '../../organization/utils';
import {
  addExpandedOrganization,
  removeExpandedOrganization,
} from '../actions';
import { expandedOrganizationsSelector } from '../selectors';
import { OrganizationsLocationState } from '../types';
import { getOrganizationItemId } from '../utils';
import styles from './organizationsTable.module.scss';
import SubOrganizationRows from './SubOrganizationRows';

interface Props {
  level?: number;
  onRowClick: (organization: OrganizationFieldsFragment) => void;
  organization: OrganizationFieldsFragment;
  showSubOrganization: boolean;
  sortedOrganizations: OrganizationFieldsFragment[];
}

const OrganizationsTableRow: React.FC<Props> = ({
  level = 0,
  onRowClick,
  organization,
  showSubOrganization = true,
  sortedOrganizations,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<OrganizationsLocationState>();
  const locale = useLocale();
  const dispatch = useDispatch();
  const expandedOrganizations = useSelector(expandedOrganizationsSelector);
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const {
    affiliatedOrganizations,
    classification,
    dataSource,
    id,
    name,
    organizationUrl,
    parentOrganization: parentOrganizationAtId,
    subOrganizations,
  } = getOrganizationFields(organization, locale, t);
  const subOrganizationIds = [...affiliatedOrganizations, ...subOrganizations];
  const parentOrganization = sortedOrganizations.find(
    (o) => o.atId === parentOrganizationAtId
  );
  const { name: parentOrganizationName } = parentOrganization
    ? getOrganizationFields(parentOrganization, locale, t)
    : { name: '' };

  const open = expandedOrganizations.includes(id);

  const toggle = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (open) {
      dispatch(removeExpandedOrganization(id));
    } else {
      dispatch(addExpandedOrganization(id));
    }
  };

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(organization);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(organization);
    }
  };

  React.useEffect(() => {
    if (location.state?.organizationId) {
      scrollToItem(getOrganizationItemId(location.state.organizationId));
      // Clear organizationId value to keep scroll position correctly
      const state = omit(location.state, 'organizationId');
      // location.search seems to reset if not added here (...location)
      history.replace({ ...location, state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getOrganizationItemId(id)}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.nameColumn}>
          <div
            className={styles.nameWrapper}
            style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}
          >
            {showSubOrganization && !!subOrganizationIds.length && (
              <button
                aria-label={
                  open
                    ? t(
                        'organizationsPage.organizationsTable.hideSubOrganizations',
                        { name }
                      )
                    : t(
                        'organizationsPage.organizationsTable.showSubOrganizations',
                        { name }
                      )
                }
                onClick={toggle}
              >
                {open ? (
                  <IconAngleUp aria-hidden={true} size="s" />
                ) : (
                  <IconAngleDown aria-hidden={true} size="s" />
                )}
              </button>
            )}
            <span className={styles.organizationName} title={name}>
              <Link onClick={(e) => e.preventDefault()} to={organizationUrl}>
                {name}
              </Link>
            </span>
          </div>
        </td>

        <td className={styles.idColumn}>{id}</td>
        <td className={styles.dataSourceColumn}>{dataSource || '–'}</td>
        <td className={styles.classificationColumn}>{classification || '–'}</td>
        <td className={styles.parentColumn}>
          <div className={styles.nameWrapper}>
            <span
              className={styles.organizationName}
              title={parentOrganizationName}
            >
              {parentOrganizationName || '–'}
            </span>
          </div>
        </td>
        <td className={styles.actionButtonsColumn}></td>
      </tr>
      {!!subOrganizationIds.length && open && (
        <SubOrganizationRows
          organizationId={id}
          level={level}
          onRowClick={onRowClick}
          showSubOrganization={showSubOrganization}
          sortedOrganizations={sortedOrganizations}
        />
      )}
    </>
  );
};

export default OrganizationsTableRow;
