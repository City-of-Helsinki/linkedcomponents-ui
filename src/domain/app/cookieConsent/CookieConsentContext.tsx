import React from 'react';
import { useLocation } from 'react-router';

import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import CookienConsentModal from './CookieConsentModal';
import { Consent } from './types';

const COOKIE_NAME = 'CONSENT';

const setCookie = (name: string, value: string, expdays: number) => {
  const d = new Date();
  d.setTime(d.getTime() + expdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string): string => {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1] ?? ''
  );
};

const NO_COOKIE_CONSENT_PATHS: string[] = [
  ROUTES.SUPPORT,
  ROUTES.SUPPORT_TERMS_OF_USE,
  ROUTES.SUPPORT_CONTACT,
];

export type CookieConsentContextType = {
  consent: Consent;
  isConsentModalOpen: boolean;
  setConsent: (consent: Consent) => void;
  setIsConsentModalOpen: (isOpen: boolean) => void;
};

const defaultConsent: Consent = {
  acceptedAt: '',
  required: false,
  tracking: false,
};

const getInitialConsent = (): Consent => {
  try {
    const consent = JSON.parse(getCookie(COOKIE_NAME));
    /* istanbul ignore next */
    return {
      acceptedAt: consent.acceptedAt ?? defaultConsent.acceptedAt,
      required: consent.required ?? defaultConsent.required,
      tracking: consent.tracking ?? defaultConsent.tracking,
    };
  } catch (e) {
    return defaultConsent;
  }
};

const CookieConsentContext = React.createContext<CookieConsentContextType>({
  consent: { acceptedAt: '', required: false, tracking: false },
  isConsentModalOpen: false,
  setConsent: /* istanbul ignore next */ () => undefined,
  setIsConsentModalOpen: /* istanbul ignore next */ () => undefined,
});

export const CookieConsentProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const locale = useLocale();
  const { pathname } = useLocation();
  const [isConsentModalOpen, setIsConsentModalOpen] = React.useState(false);
  const [consent, setConsent] = React.useState<Consent>(getInitialConsent());

  const saveConsentToCookie = (options: Omit<Consent, 'acceptedAt'>) => {
    const consent = { ...options, acceptedAt: new Date().toISOString() };
    setCookie(COOKIE_NAME, JSON.stringify(consent), 365);
    setConsent(consent);
    setIsConsentModalOpen(false);
  };

  React.useEffect(() => {
    if (
      !NO_COOKIE_CONSENT_PATHS.includes(pathname.replace(`/${locale}`, '')) &&
      !consent.acceptedAt
    ) {
      setIsConsentModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        isConsentModalOpen,
        setConsent: saveConsentToCookie,
        setIsConsentModalOpen,
      }}
    >
      <CookienConsentModal
        isOpen={isConsentModalOpen}
        saveConsentToCookie={saveConsentToCookie}
      />
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType =>
  React.useContext(CookieConsentContext);
