import orderBy from 'lodash/orderBy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import Checkbox from '../../../common/components/checkbox/Checkbox';
import {
  AttendeeStatus,
  EnrolmentFieldsFragment,
  PresenceStatus,
  RegistrationFieldsFragment,
  UpdateEnrolmentMutationInput,
  useUpdateEnrolmentMutation,
} from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import useUser from '../../user/hooks/useUser';

type Props = {
  registration: RegistrationFieldsFragment;
};
const AttendeeList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useUser();

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const attendees = orderBy(
    getValue(registration.signups, []) as EnrolmentFieldsFragment[],
    ['name'],
    ['asc']
  ).filter((signup) => signup.attendeeStatus === AttendeeStatus.Attending);

  const filteredAttendees = attendees.filter((signup) =>
    signup.name?.toLowerCase().includes(search.toLowerCase())
  );

  const [updateEnrolmentMutation] = useUpdateEnrolmentMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const handleError = ({
    error,
    message,
    payload,
    signup,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload?: UpdateEnrolmentMutationInput;
    signup: EnrolmentFieldsFragment;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        signup,
      },
      location,
      message,
      user,
    });
  };

  const updateEnrolment = async (
    checked: boolean,
    signup: EnrolmentFieldsFragment
  ) => {
    const payload: UpdateEnrolmentMutationInput = {
      id: signup.id,
      presenceStatus: checked
        ? PresenceStatus.Present
        : PresenceStatus.NotPresent,
      registration: registration.id,
    };
    try {
      setSaving(true);

      await updateEnrolmentMutation({
        variables: {
          input: payload,
          signup: signup.id,
        },
      });

      savingFinished();
    } catch (error) /* istanbul ignore next */ {
      handleError({
        error,
        message: 'Failed to update enrolment presence status',
        payload,
        signup,
      });
    }
  };
  return (
    <>
      <AdminSearchRow
        countText={t('attendanceListPage.count', {
          count: attendees.length,
        })}
        onSearchSubmit={() => undefined}
        onSearchChange={setSearch}
        searchInputLabel={t('attendanceListPage.labelSearch')}
        searchValue={search}
      />
      {filteredAttendees.map((signup) => (
        <Checkbox
          disabled={saving}
          key={signup.id}
          id={signup.id}
          label={signup.name}
          checked={signup.presenceStatus === PresenceStatus.Present}
          onChange={(e) => {
            updateEnrolment(e.target.checked, signup);
          }}
        />
      ))}
      {filteredAttendees.length === 0 && <span>{t('common.noResults')}</span>}
    </>
  );
};

export default AttendeeList;
