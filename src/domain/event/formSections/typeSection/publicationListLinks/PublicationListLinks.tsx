import React from 'react';

export type PublicationListLink = {
  href: string;
  text: string;
};

type Props = {
  links: PublicationListLink[];
};

const PublicationListLinks: React.FC<Props> = ({ links }) => {
  return (
    <>
      {links
        .map(({ href, text }) => {
          return (
            <a key={href} href={href} target="_blank" rel="noreferrer">
              <strong>{text}</strong>
            </a>
          );
        })
        .reduce((prev: React.ReactNode[], curr) => [prev, ', ', curr], [])}
    </>
  );
};

export default PublicationListLinks;
