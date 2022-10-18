import * as fs from 'fs';
import { promisify } from 'util';
import * as convert from 'xml-js';

import { ROUTES, SUPPORTED_LANGUAGES } from '../src/constants';
import { isFeatureEnabled } from '../src/utils/featureFlags';
import { HOST, PATH_TO_BUILD_FOLDER, SITEMAP_FILENAME } from './constants';

const LANGUAGES = Object.values(SUPPORTED_LANGUAGES);
const STATIC_URLS_BLACK_LIST = [
  ROUTES.ADMIN,
  ROUTES.CALLBACK,
  ROUTES.CREATE_ENROLMENT,
  ROUTES.CREATE_EVENT,
  ROUTES.CREATE_REGISTRATION,
  ROUTES.EDIT_EVENT,
  ROUTES.EDIT_IMAGE,
  ROUTES.EDIT_KEYWORD,
  ROUTES.EDIT_KEYWORD_SET,
  ROUTES.EDIT_ORGANIZATION,
  ROUTES.EDIT_PLACE,
  ROUTES.EDIT_REGISTRATION,
  ROUTES.EDIT_REGISTRATION_ENROLMENT,
  ROUTES.EVENT_SAVED,
  ROUTES.EVENTS,
  ROUTES.HELP,
  ROUTES.INSTRUCTIONS,
  ROUTES.LOGOUT,
  ROUTES.REGISTRATIONS,
  ROUTES.REGISTRATION_ENROLMENTS,
  ROUTES.REGISTRATION_SAVED,
  ROUTES.SEARCH,
  ROUTES.SILENT_CALLBACK,
  ROUTES.SUPPORT,
  ROUTES.TECHNOLOGY,
].concat(
  isFeatureEnabled('SHOW_ADMIN')
    ? []
    : [
        ROUTES.CREATE_IMAGE,
        ROUTES.CREATE_KEYWORD,
        ROUTES.CREATE_KEYWORD_SET,
        ROUTES.CREATE_ORGANIZATION,
        ROUTES.CREATE_PLACE,
        ROUTES.IMAGES,
        ROUTES.KEYWORDS,
        ROUTES.KEYWORD_SETS,
        ROUTES.ORGANIZATIONS,
        ROUTES.PLACES,
      ]
);

const STATIC_URLS = Object.values(ROUTES).filter(
  (route) => !STATIC_URLS_BLACK_LIST.includes(route)
);

export type Element = {
  type: string;
  attributes?: Record<string, unknown>;
  name: string;
  elements: Record<string, unknown>[];
};

const formatDate = (date: Date): string => date.toISOString();

const getElement = ({
  attributes,
  elements,
  name,
}: {
  attributes?: Record<string, unknown>;
  elements: Record<string, unknown>[];
  name: string;
}) => ({
  type: 'element',
  attributes,
  name,
  elements,
});

const getTextElement = (name: string, text: string) => ({
  type: 'element',
  name,
  elements: [
    {
      type: 'text',
      text,
    },
  ],
});

const getStaticUrlElements = (time: Date): Element[] => {
  const elements: Element[] = [];

  STATIC_URLS.forEach((url) => {
    LANGUAGES.forEach((language) => {
      const element = getElement({
        name: 'url',
        elements: [
          getTextElement('loc', `${HOST}/${language}${url}`),
          ...LANGUAGES.filter((l) => l !== language).map((hreflang) =>
            getElement({
              name: 'xhtml:link',
              attributes: {
                rel: 'alternate',
                hreflang,
                href: `${HOST}/${hreflang}${url}`,
              },
              elements: [],
            })
          ),
          getTextElement('lastmod', formatDate(time)),
        ],
      });
      elements.push(element);
    });
  });

  return elements;
};

const writeFile = promisify(fs.writeFile);

const writeXMLFile = (path: string, data: Record<string, unknown>) => {
  const options = { compact: false, ignoreComment: true, spaces: 4 };
  const xml = convert.js2xml(data, options);

  return writeFile(path, xml, 'utf8');
};

const saveSitemapFile = (elements: Element[]) => {
  const data = {
    declaration: {
      attributes: {
        version: '1.0',
        encoding: 'UTF-8',
      },
    },
    elements: [
      {
        type: 'element',
        name: 'urlset',
        attributes: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        },
        elements,
      },
    ],
  };

  return writeXMLFile(`${PATH_TO_BUILD_FOLDER}/${SITEMAP_FILENAME}`, data);
};

const generateSitemap = async () => {
  try {
    const time = new Date();

    const staticUrlElements = getStaticUrlElements(time);

    await saveSitemapFile(staticUrlElements);
    return true;
  } catch (err) {
    throw err;
  }
};

// Generate sitemap only if GENERATE_SITEMAP flag is true and PUBLIC_URL is set
if (HOST && process.env.GENERATE_SITEMAP === 'true') {
  generateSitemap();
}
