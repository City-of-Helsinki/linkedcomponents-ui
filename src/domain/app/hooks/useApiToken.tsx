import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { resetApiTokenData } from '../../auth/actions';
import { getApiToken, renewApiToken } from '../../auth/authenticate';
import { apiTokenSelector, userSelector } from '../../auth/selectors';

// update api token every minute
const API_TOKEN_EXPIRATION_TIME = 60000;
const API_TOKEN_NOTIFICATION_TIME = 5000;
const API_TOKEN_CHECK_INTERVAL = 5000;

const useApiToken = () => {
  const timer = React.useRef<NodeJS.Timeout>();
  const apiTokenExpiring = React.useRef<number | null>(null);
  const dispatch = useDispatch();
  const apiToken = useSelector(apiTokenSelector);
  const user = useSelector(userSelector);

  const startTimer = () => {
    apiTokenExpiring.current = new Date().valueOf() + API_TOKEN_EXPIRATION_TIME;

    timer.current = setInterval(() => {
      // At the moment api token is not respecting api token exp time
      // Update api token in UI every minute to avoid "JWT too old" errors
      const isApiTokenExpiring =
        apiTokenExpiring.current &&
        new Date().valueOf() >
          apiTokenExpiring.current - API_TOKEN_NOTIFICATION_TIME;

      if (user?.access_token && isApiTokenExpiring) {
        dispatch(renewApiToken(user.access_token));
      }
    }, API_TOKEN_CHECK_INTERVAL);
  };

  const stopTimer = () => {
    timer.current && clearTimeout(timer.current);
  };

  React.useEffect(() => {
    // Get new api token after new access token
    if (user?.access_token) {
      dispatch(getApiToken(user.access_token));
    } else {
      dispatch(resetApiTokenData());
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    if (apiToken) {
      // To make sure only one timer is running stop timer before starting it
      stopTimer();
      startTimer();
    } else {
      stopTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToken]);

  React.useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);
};

export default useApiToken;
