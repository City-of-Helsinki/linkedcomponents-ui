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
    <strong>
      {links.map(({ href, text }, index, array) => {
        return (
          <React.Fragment key={index}>
            <a href={href} target="_blank" rel="noreferrer">
              {text}
            </a>
            {index + 1 < array.length && ', '}
          </React.Fragment>
        );
      })}
    </strong>
  );
};

export default PublicationListLinks;
