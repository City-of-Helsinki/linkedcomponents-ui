import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import removeProtocolFromUrl from '../../../utils/removeProtocolFromUrl';

type Props = {
  showExplanations?: boolean;
};

const SourceCodeLinks: FC<Props> = ({ showExplanations }) => {
  const { t } = useTranslation();

  const links = [
    {
      explanation: t('helpPage.sourceCodeLinks.api'),
      link: 'https://github.com/City-of-Helsinki/linkedevents',
    },
    {
      explanation: t('helpPage.sourceCodeLinks.linkedEventsUi'),
      link: 'https://github.com/City-of-Helsinki/linkedcomponents-ui',
    },
    {
      explanation: t('helpPage.sourceCodeLinks.linkedRegistrationsUi'),
      link: 'https://github.com/City-of-Helsinki/linkedregistrations-ui',
    },
  ];

  return (
    <>
      {links.map(({ explanation, link }, index) => (
        <p key={index}>
          <ExternalLink href={link}>{removeProtocolFromUrl(link)}</ExternalLink>
          {showExplanations && ` (${explanation})`}
        </p>
      ))}
    </>
  );
};

export default SourceCodeLinks;
