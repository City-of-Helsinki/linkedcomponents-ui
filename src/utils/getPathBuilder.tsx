import { PathBuilderProps } from '../types';
import isTestEnv from './isTestEnv';

type PathBuilder = (options: PathBuilderProps<any>) => string;

const getPathBuilder = (pathBuilder: PathBuilder): PathBuilder | undefined =>
  isTestEnv ? undefined : /* istanbul ignore next */ pathBuilder;

export default getPathBuilder;
