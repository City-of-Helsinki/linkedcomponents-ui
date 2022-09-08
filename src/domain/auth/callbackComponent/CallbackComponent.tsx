import { User, UserManager } from 'oidc-client';
import { FC, PropsWithChildren, useEffect } from 'react';

interface CallbackComponentProps {
  userManager: UserManager;
  successCallback: (user: User) => void;
  errorCallback?: (error: Error) => void;
}

const CallbackComponent: FC<PropsWithChildren<CallbackComponentProps>> = ({
  children,
  errorCallback,
  successCallback,
  userManager,
}) => {
  const onRedirectSuccess = (user: User) => {
    successCallback(user);
  };

  const onRedirectError = (error: Error) => {
    if (errorCallback) {
      errorCallback(error);
    } else {
      throw new Error(`Error handling redirect callback: ${error.message}`);
    }
  };

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then((user) => onRedirectSuccess(user))
      .catch((error) => onRedirectError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default CallbackComponent;
