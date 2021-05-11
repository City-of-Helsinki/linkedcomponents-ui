import { PathBuilderProps } from '../types';
import isTestEnv from './isTestEnv';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PathBuilder = (options: PathBuilderProps<any>) => string;

const getPathBuilder = (pathBuilder: PathBuilder): PathBuilder | undefined =>
  isTestEnv ? undefined : /* istanbul ignore next */ pathBuilder;

export default getPathBuilder;
