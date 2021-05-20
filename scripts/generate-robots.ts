import * as fs from 'fs';

import { DEPRECATED_ROUTES, ROUTES } from '../src/constants';
import {
  HOST,
  PATH_TO_BUILD_FOLDER,
  ROBOTS_FILENAME,
  SITEMAP_FILENAME,
} from './constants';

const DISALLOWED_URLS = [
  `/*${ROUTES.CREATE_EVENT}`,
  `/*${ROUTES.EDIT_EVENT.replace(':id', '*')}`,
  DEPRECATED_ROUTES.CREATE_EVENT,
  `${DEPRECATED_ROUTES.UPDATE_EVENT.replace(':id', '*')}`,
  `${DEPRECATED_ROUTES.VIEW_EVENT.replace(':id', '*')}`,
];

const generateRobotsTxt = async () => {
  try {
    const writeStream = fs.createWriteStream(
      `${PATH_TO_BUILD_FOLDER}/${ROBOTS_FILENAME}`
    );

    writeStream.write(`# https://www.robotstxt.org/robotstxt.html\n`);
    writeStream.write(`User-agent: *\n`);
    DISALLOWED_URLS.forEach((url) => {
      writeStream.write(`Disallow: ${url}\n`);
    });

    if (process.env.GENERATE_SITEMAP === 'true') {
      writeStream.write('\n');
      writeStream.write(`Sitemap: ${HOST}/${SITEMAP_FILENAME}\n`);
    }

    // close the stream
    writeStream.end();
  } catch (err) {
    throw err;
  }
};

// Generate robots.txt only if GENERATE_ROBOTS flag is true and PUBLIC_URL is set
if (HOST && process.env.GENERATE_ROBOTS === 'true') {
  generateRobotsTxt();
}
