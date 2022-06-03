import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import { scrollToItem } from '../../../../utils/scrollToItem';
import EnrolmentActionsDropdown from '../../enrolmentActionsDropdown/EnrolmentActionsDropdown';
import { EnrolmentsLocationState } from '../../types';
import { getEnrolmentFields, getEnrolmentItemId } from '../../utils';
import styles from '../enrolmentsTable.module.scss';

interface Props {
  enrolment: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
  onRowClick: (enrolment: EnrolmentFieldsFragment) => void;
}

const EnrolmentsTableRow: React.FC<Props> = ({
  enrolment,
  onRowClick,
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const { attendeeStatus, email, id, name, phoneNumber } = getEnrolmentFields({
    enrolment,
    language: locale,
    registration,
  });

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(enrolment);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(enrolment);
    }
  };

  React.useEffect(() => {
    const locationState = location.state as EnrolmentsLocationState;
    if (locationState?.enrolmentId === id) {
      scrollToItem(getEnrolmentItemId(locationState.enrolmentId));
      // Clear registrationId value to keep scroll position correctly
      const state = omit(locationState, 'enrolmentId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getEnrolmentItemId(id)}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.nameColumn}>
          <div className={styles.nameWrapper}>
            <span className={styles.enrolmentName} title={name}>
              {name}
            </span>
          </div>
        </td>
        <td className={styles.emailColumn}>
          {email || /* istanbul ignore next */ '-'}
        </td>
        <td className={styles.phoneColumn}>
          {phoneNumber || /* istanbul ignore next */ '-'}
        </td>
        <td className={styles.statusColumn}>
          {t(`enrolment.attendeeStatus.${attendeeStatus}`)}
        </td>
        <td className={styles.actionButtonsColumn}>
          <EnrolmentActionsDropdown
            ref={actionsDropdownRef}
            enrolment={enrolment}
            registration={registration}
          />
        </td>
      </tr>
    </>
  );
};

export default EnrolmentsTableRow;
