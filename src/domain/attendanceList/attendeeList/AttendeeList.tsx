import orderBy from 'lodash/orderBy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';

import Checkbox from '../../../common/components/checkbox/Checkbox';
import {
  AttendeeStatus,
  EnrolmentFieldsFragment,
  PresenceStatus,
  RegistrationFieldsFragment,
  UpdateEnrolmentMutationInput,
  usePatchEnrolmentMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import { reportError } from '../../app/sentry/utils';
import { getEnrolmentFields } from '../../enrolments/utils';
import useUser from '../../user/hooks/useUser';

type Props = {
  registration: RegistrationFieldsFragment;
};
const AttendeeList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const locale = useLocale();
  const { user } = useUser();

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const attendees = orderBy(
    getValue(registration.signups, []) as EnrolmentFieldsFragment[],
    ['name'],
    ['asc']
  ).filter((signup) => signup.attendeeStatus === AttendeeStatus.Attending);

  const filteredAttendees = attendees.filter((signup) => {
    const { firstName, lastName } = getEnrolmentFields({
      enrolment: signup,
      registration,
      language: locale,
    });
    const firstLastName = [firstName, lastName].filter(skipFalsyType).join(' ');
    const lastFirstName = [lastName, firstName].filter(skipFalsyType).join(' ');

    return (
      firstLastName.toLowerCase().includes(search.toLowerCase()) ||
      lastFirstName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const [patchEnrolmentMutation] = usePatchEnrolmentMutation();

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

  const patchEnrolment = async (
    checked: boolean,
    signup: EnrolmentFieldsFragment
  ) => {
    const payload: UpdateEnrolmentMutationInput = {
      id: signup.id,
      presenceStatus: checked
        ? PresenceStatus.Present
        : PresenceStatus.NotPresent,
    };
    try {
      setSaving(true);

      await patchEnrolmentMutation({
        variables: {
          input: payload,
          signup: signup.id,
        },
      });

      savingFinished();
    } catch (error) /* istanbul ignore next */ {
      handleError({
        error,
        message: 'Failed to patch enrolment presence status',
        payload,
        signup,
      });
      toast.error(t('attendanceListPage.errors.presenceStatusUpdateFails'));
    }
  };
  return (
    <>
      <AdminSearchRow
        countText={t('attendanceListPage.count', {
          count: attendees.length,
        })}
        onSearchSubmit={
          /* istanbul ignore next */
          () => undefined
        }
        onSearchChange={setSearch}
        searchInputLabel={t('attendanceListPage.labelSearch')}
        searchValue={search}
      />
      {filteredAttendees.map((signup) => {
        const { fullName } = getEnrolmentFields({
          enrolment: signup,
          registration,
          language: locale,
        });

        return (
          <Checkbox
            disabled={saving}
            key={signup.id}
            id={signup.id}
            label={fullName}
            checked={signup.presenceStatus === PresenceStatus.Present}
            onChange={(e) => {
              patchEnrolment(e.target.checked, signup);
            }}
          />
        );
      })}
      {filteredAttendees.length === 0 && <span>{t('common.noResults')}</span>}
    </>
  );
};

export default AttendeeList;
