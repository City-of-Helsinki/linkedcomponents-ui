import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import AskPermissionPage from '../../../help/pages/askPermissionPage/AskPermissionPage';
import ContactPage from '../../../help/pages/contactPage/ContactPage';
import EventsInstructionsPage from '../../../help/pages/eventsInstructionsPage/EventsInstructionsPage';
import FaqPage from '../../../help/pages/faqPage/FaqPage';
import RegistrationInstructions from '../../../help/pages/registrationInstructions/RegistrationInstructions';
import ServiceInformationPage from '../../../help/pages/serviceInformation/ServiceInformationPage';
import SourceCodePage from '../../../help/pages/sourceCodePage/SourceCodePage';
import TermsOfUsePage from '../../../help/pages/termsOfUsePage/TermsOfUsePage';
import NotFound from '../../../notFound/NotFound';
/* istanbul ignore next */
const DocumentationPage = React.lazy(
  () => import('../../../help/pages/documentationPage/DocumentationPage')
);

interface Props {
  locale: Language;
}

const InstructionsRoutes: React.FC<Props> = ({ locale }) => {
  const getInstructionsRoutePath = (path: string) =>
    path.replace(ROUTES.INSTRUCTIONS, '');
  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <Routes>
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS)}
        element={
          <Navigate replace to={getLocalePath(ROUTES.INSTRUCTIONS_EVENTS)} />
        }
      />
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS_EVENTS)}
        element={<EventsInstructionsPage />}
      />
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS_FAQ)}
        element={<FaqPage />}
      />
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS_REGISTRATION)}
        element={<RegistrationInstructions />}
      />
      <Route
        element={<NotFound pathAfterSignIn={`/${locale}${ROUTES.HOME}`} />}
      />
    </Routes>
  );
};

const TechnologyRoutes: React.FC<Props> = ({ locale }) => {
  const getTechnologyRoutePath = (path: string) =>
    path.replace(ROUTES.TECHNOLOGY, '');
  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <React.Suspense fallback={<div />}>
      <Routes>
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY)}
          element={
            <Navigate
              replace
              to={getLocalePath(ROUTES.TECHNOLOGY_SOURCE_CODE)}
            />
          }
        />
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY_SOURCE_CODE)}
          element={<SourceCodePage />}
        />
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY_DOCUMENTATION)}
          element={<DocumentationPage />}
        />

        <Route
          element={<NotFound pathAfterSignIn={`/${locale}${ROUTES.HOME}`} />}
        />
      </Routes>
    </React.Suspense>
  );
};

const SupportRoutes: React.FC<Props> = ({ locale }) => {
  const getSupportRoutePath = (path: string) =>
    path.replace(ROUTES.SUPPORT, '');
  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <Routes>
      <Route
        path={getSupportRoutePath(ROUTES.SUPPORT)}
        element={
          <Navigate
            replace
            to={getLocalePath(ROUTES.SUPPORT_SERVICE_INFORMATION)}
          />
        }
      />
      <Route
        path={getSupportRoutePath(ROUTES.SUPPORT_SERVICE_INFORMATION)}
        element={<ServiceInformationPage />}
      />
      <Route
        path={getSupportRoutePath(ROUTES.SUPPORT_ASK_PERMISSION)}
        element={<AskPermissionPage />}
      />
      <Route
        path={getSupportRoutePath(ROUTES.SUPPORT_CONTACT)}
        element={<ContactPage />}
      />
      <Route
        path={getSupportRoutePath(ROUTES.SUPPORT_TERMS_OF_USE)}
        element={<TermsOfUsePage />}
      />
      <Route
        element={<NotFound pathAfterSignIn={`/${locale}${ROUTES.HOME}`} />}
      />
    </Routes>
  );
};

const HelpPageRoutes: React.FC = () => {
  const locale = useLocale();
  const getHelpRoutePath = (path: string) => path.replace(ROUTES.HELP, '');
  const getLocalePath = (path: string) => `/${locale}${path}`;

  return (
    <Routes>
      <Route
        path={getHelpRoutePath(ROUTES.HELP)}
        element={<Navigate replace to={getLocalePath(ROUTES.SUPPORT)} />}
      />
      <Route
        path={`${getHelpRoutePath(ROUTES.SUPPORT)}/*`}
        element={<SupportRoutes locale={locale} />}
      />
      <Route
        path={`${getHelpRoutePath(ROUTES.INSTRUCTIONS)}/*`}
        element={<InstructionsRoutes locale={locale} />}
      />
      <Route
        path={`${getHelpRoutePath(ROUTES.TECHNOLOGY)}/*`}
        element={<TechnologyRoutes locale={locale} />}
      />
      <Route
        path="*"
        element={<NotFound pathAfterSignIn={`/${locale}${ROUTES.HOME}`} />}
      />
    </Routes>
  );
};

export default HelpPageRoutes;
