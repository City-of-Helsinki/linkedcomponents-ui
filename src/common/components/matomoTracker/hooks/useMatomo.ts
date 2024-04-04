import { useCallback, useContext } from 'react';

import { MatomoContext, MatomoInstance } from '../matomo-context';

function useMatomo() {
  const instance: MatomoInstance | null = useContext(MatomoContext);

  const trackPageView = useCallback(
    (params: unknown) => instance?.trackPageView(params),
    [instance]
  );

  return { trackPageView };
}

export default useMatomo;
