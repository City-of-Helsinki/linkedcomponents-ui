import React from 'react';
import { Route, Routes } from 'react-router';

import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../../../constants';
import NotFoundPage from '../../../notFound/NotFound';
import useUser from '../../../user/hooks/useUser';
import { areRegistrationRoutesAllowed } from '../../../user/permissions';

const AttendanceListPage = React.lazy(
  () => import('../../../attendanceList/AttendanceListPage')
);
const CreateRegistrationPage = React.lazy(
  () => import('../../../registration/CreateRegistrationPage')
);
const CreateSignupGroupPage = React.lazy(
  () => import('../../../signupGroup/CreateSignupGroupPage')
);
const EditRegistrationPage = React.lazy(
  () => import('../../../registration/EditRegistrationPage')
);
const EditSignupGroupPage = React.lazy(
  () => import('../../../signupGroup/EditSignupGroupPage')
);
const EditSignupPage = React.lazy(
  () => import('../../../signup/EditSignupPage')
);
const RegistrationSavedPage = React.lazy(
  () => import('../../../registrationSaved/RegistrationSavedPage')
);
const RegistrationsPage = React.lazy(
  () => import('../../../registrations/RegistrationsPage')
);
const SignupsPage = React.lazy(() => import('../../../signups/SignupsPage'));

const RegistrationRoutes: React.FC = () => {
  const { loading, user } = useUser();
  const getRegistrationRoutePath = (path: string) =>
    path.replace(ROUTES.REGISTRATIONS, '');

  return (
    <LoadingSpinner isLoading={loading}>
      {areRegistrationRoutesAllowed(user) ? (
        <Routes>
          <Route
            path={getRegistrationRoutePath(ROUTES.CREATE_REGISTRATION)}
            element={<CreateRegistrationPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.REGISTRATION_SAVED)}
            element={<RegistrationSavedPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.EDIT_REGISTRATION)}
            element={<EditRegistrationPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.REGISTRATIONS)}
            element={<RegistrationsPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.REGISTRATION_SIGNUPS)}
            element={<SignupsPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.ATTENDANCE_LIST)}
            element={<AttendanceListPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.CREATE_SIGNUP_GROUP)}
            element={<CreateSignupGroupPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.EDIT_SIGNUP_GROUP)}
            element={<EditSignupGroupPage />}
          />
          <Route
            path={getRegistrationRoutePath(ROUTES.EDIT_SIGNUP)}
            element={<EditSignupPage />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      ) : (
        <NotFoundPage />
      )}
    </LoadingSpinner>
  );
};

export default RegistrationRoutes;
