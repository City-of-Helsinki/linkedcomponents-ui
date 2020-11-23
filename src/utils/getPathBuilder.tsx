import isTestEnv from './isTestEnv';

interface Options {
  args: any;
}

type PathBuilder = (options: Options) => string;

const getPathBuilder = (pathBuilder: PathBuilder): PathBuilder | undefined =>
  isTestEnv ? undefined : /* istanbul ignore next */ pathBuilder;

export default getPathBuilder;
