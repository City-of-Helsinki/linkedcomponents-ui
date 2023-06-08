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
    <ul style={{ paddingInlineStart: 'var(--spacing-s)' }}>
      {links.map(({ href, text }) => {
        return (
          <li key={href}>
            <a href={href} target="_blank" rel="noreferrer">
              <strong>{text}</strong>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default PublicationListLinks;
