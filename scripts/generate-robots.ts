/* eslint-disable @typescript-eslint/ban-ts-comment */
import dotenv from 'dotenv';
import * as fs from 'fs';

import { DEPRECATED_ROUTES, ROUTES } from '../src/constants';
import {
  HOST,
  PATH_TO_BUILD_FOLDER,
  ROBOTS_FILENAME,
  SITEMAP_FILENAME,
} from './constants';
/* @ts-ignore */
import.meta.env = {};
dotenv.config({ processEnv: import.meta.env });

const getDisallowedUrls = async () => {
  const { featureFlagUtils } = await import('../src/utils/featureFlags');

  return [
    `/*${ROUTES.CREATE_EVENT}`,
    `/*${ROUTES.EDIT_EVENT.replace(':id', '*')}`,
    DEPRECATED_ROUTES.CREATE_EVENT,
    `${DEPRECATED_ROUTES.UPDATE_EVENT.replace(':id', '*')}`,
    `${DEPRECATED_ROUTES.VIEW_EVENT.replace(':id', '*')}`,
  ]
    .concat(
      featureFlagUtils.isFeatureEnabled('SHOW_ADMIN')
        ? [
            `/*${ROUTES.EDIT_IMAGE.replace(':id', '*')}`,
            `/*${ROUTES.EDIT_KEYWORD.replace(':id', '*')}`,
            `/*${ROUTES.EDIT_KEYWORD_SET.replace(':id', '*')}`,
            `/*${ROUTES.EDIT_ORGANIZATION.replace(':id', '*')}`,
            `/*${ROUTES.EDIT_PLACE.replace(':id', '*')}`,
          ]
        : []
    )
    .concat([`/*${ROUTES.REGISTRATIONS}`, `/*${ROUTES.REGISTRATIONS}/*`]);
};

const generateRobotsTxt = async () => {
  const disallowedUrls = await getDisallowedUrls();
  const writeStream = fs.createWriteStream(
    `${PATH_TO_BUILD_FOLDER}/${ROBOTS_FILENAME}`
  );

  writeStream.write(`# https://www.robotstxt.org/robotstxt.html\n`);
  writeStream.write(`User-agent: *\n`);
  disallowedUrls.forEach((url) => {
    writeStream.write(`Disallow: ${url}\n`);
  });

  if (import.meta.env.GENERATE_SITEMAP === 'true') {
    writeStream.write('\n');
    writeStream.write(`Sitemap: ${HOST}/${SITEMAP_FILENAME}\n`);
  }

  // close the stream
  writeStream.end();
};

// Generate robots.txt only if GENERATE_ROBOTS flag is true and PUBLIC_URL is set
if (HOST && import.meta.env.GENERATE_ROBOTS === 'true') {
  generateRobotsTxt();
}
