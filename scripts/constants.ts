/* eslint-disable @typescript-eslint/ban-ts-comment */
import dotenv from 'dotenv';
import * as path from 'path';
/* @ts-ignore */
import.meta.env = {};
dotenv.config({ processEnv: import.meta.env });

export const PATH_TO_BUILD_FOLDER = path.resolve('./build');
export const HOST = import.meta.env.PUBLIC_URL;
export const ROBOTS_FILENAME = 'robots.txt';
export const SITEMAP_FILENAME = 'sitemap.xml';
