import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import ApiPage from '../../../help/pages/apiPage/ApiPage';
import AskPermissionPage from '../../../help/pages/askPermissionPage/AskPermissionPage';
import ContactPage from '../../../help/pages/contactPage/ContactPage';
import ControlPanelPage from '../../../help/pages/controlPanelPage/ControlPanelPage';
import FaqPage from '../../../help/pages/faqPage/FaqPage';
import FeaturesPage from '../../../help/pages/featuresPage/FeaturesPage';
import GeneralInstructionsPage from '../../../help/pages/generalInstructionsPage/GeneralInstructionsPage';
import GeneralTechnologyPage from '../../../help/pages/generalTechologyPage/GeneralTechnologyPage';
import ImageRightsPage from '../../../help/pages/imageRightsPage/ImageRightsPage';
import PlatformPage from '../../../help/pages/platformPage/PlatformPage';
import SourceCodePage from '../../../help/pages/sourceCodePage/SourceCodePage';
import TermsOfUsePage from '../../../help/pages/termsOfUsePage/TermsOfUsePage';
import NotFound from '.././../../notFound/NotFound';
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
          <Navigate replace to={getLocalePath(ROUTES.INSTRUCTIONS_GENERAL)} />
        }
      />
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS_CONTROL_PANEL)}
        element={<ControlPanelPage />}
      />
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS_FAQ)}
        element={<FaqPage />}
      />
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS_GENERAL)}
        element={<GeneralInstructionsPage />}
      />
      <Route
        path={getInstructionsRoutePath(ROUTES.INSTRUCTIONS_PLATFORM)}
        element={<PlatformPage />}
      />
      <Route element={<NotFound />} />
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
            <Navigate replace to={getLocalePath(ROUTES.TECHNOLOGY_GENERAL)} />
          }
        />
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY_API)}
          element={<ApiPage />}
        />
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY_DOCUMENTATION)}
          element={<DocumentationPage />}
        />
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY_GENERAL)}
          element={<GeneralTechnologyPage />}
        />
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY_IMAGE_RIGHTS)}
          element={<ImageRightsPage />}
        />
        <Route
          path={getTechnologyRoutePath(ROUTES.TECHNOLOGY_SOURCE_CODE)}
          element={<SourceCodePage />}
        />
        <Route element={<NotFound />} />
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
          <Navigate replace to={getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE)} />
        }
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
      <Route element={<NotFound />} />
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
        element={<Navigate replace to={getLocalePath(ROUTES.INSTRUCTIONS)} />}
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
        path={`${getHelpRoutePath(ROUTES.SUPPORT)}/*`}
        element={<SupportRoutes locale={locale} />}
      />
      <Route
        path={getHelpRoutePath(ROUTES.FEATURES)}
        element={<FeaturesPage />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default HelpPageRoutes;
