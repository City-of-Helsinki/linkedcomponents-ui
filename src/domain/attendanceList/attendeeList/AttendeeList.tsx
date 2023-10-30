import orderBy from 'lodash/orderBy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox from '../../../common/components/checkbox/Checkbox';
import {
  AttendeeStatus,
  PresenceStatus,
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  UpdateSignupMutationInput,
  usePatchSignupMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import AdminSearchRow from '../../admin/layout/adminSearchRow/AdminSearchRow';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { getSignupFields } from '../../signups/utils';

type Props = {
  registration: RegistrationFieldsFragment;
};
const AttendeeList: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { addNotification } = useNotificationsContext();

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const attendees = orderBy(
    getValue(registration.signups, []) as SignupFieldsFragment[],
    ['firstName', 'lastName'],
    ['asc', 'desc']
  ).filter((signup) => signup.attendeeStatus === AttendeeStatus.Attending);

  const filteredAttendees = attendees.filter((signup) => {
    const { firstName, lastName } = getSignupFields({
      language: locale,
      registration,
      signup,
    });
    const firstLastName = [firstName, lastName].filter(skipFalsyType).join(' ');
    const lastFirstName = [lastName, firstName].filter(skipFalsyType).join(' ');

    return (
      firstLastName.toLowerCase().includes(search.toLowerCase()) ||
      lastFirstName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const [patchSignupMutation] = usePatchSignupMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const { handleError } = useHandleError<UpdateSignupMutationInput, null>();

  const patchSignup = async (
    checked: boolean,
    signup: SignupFieldsFragment
  ) => {
    const payload: UpdateSignupMutationInput = {
      id: signup.id,
      presenceStatus: checked
        ? PresenceStatus.Present
        : PresenceStatus.NotPresent,
    };
    try {
      setSaving(true);

      await patchSignupMutation({
        variables: { input: payload, id: signup.id },
      });

      savingFinished();
    } catch (error) /* istanbul ignore next */ {
      handleError({
        error,
        message: 'Failed to patch signup presence status',
        payload,
        savingFinished,
      });
      addNotification({
        label: t('attendanceListPage.errors.presenceStatusUpdateFails'),
        type: 'error',
      });
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
        const { fullName } = getSignupFields({
          registration,
          language: locale,
          signup,
        });

        return (
          <Checkbox
            disabled={saving}
            key={signup.id}
            id={signup.id}
            label={fullName}
            checked={signup.presenceStatus === PresenceStatus.Present}
            onChange={(e) => {
              patchSignup(e.target.checked, signup);
            }}
          />
        );
      })}
      {filteredAttendees.length === 0 && <span>{t('common.noResults')}</span>}
    </>
  );
};

export default AttendeeList;
