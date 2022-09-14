import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ExternalLink from '../../../../common/components/externalLink/ExternalLink';
import { SWAGGER_URL } from '../../../../constants';
import removeProtocolFromUrl from '../../../../utils/removeProtocolFromUrl';

type Props = {
  showExplanations?: boolean;
};

const SwaggerLink: FC<Props> = ({ showExplanations }) => {
  const { t } = useTranslation();

  return (
    <p>
      <ExternalLink href={SWAGGER_URL}>
        {removeProtocolFromUrl(SWAGGER_URL)}
      </ExternalLink>
      {showExplanations && ` (${t('helpPage.sourceCodeLinks.documentation')})`}
    </p>
  );
};

export default SwaggerLink;
