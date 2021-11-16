import { SEARCH_PARAMS } from '../constants';
import { ReturnParams } from '../types';

/**
 * Extracts latest return path from queryString. For example on:
 * http://localhost:3000/fi/event/kulke:53397?returnPath=%2Fevents&returnPath=%2Fevent%2Fhelsinki%3Aaf3pnza3zi
 * latest return path is in the last returnPath param on queryString : %2Fevent%2Fhelsinki%3Aaf3pnza3zi
 */
const extractLatestReturnPath = (
  queryString: string,
  defaultReturnPath: string
): ReturnParams => {
  const searchParams = new URLSearchParams(queryString);
  const returnPaths = searchParams.getAll(SEARCH_PARAMS.RETURN_PATH);
  // latest path is the last item, it can be popped. If empty, defaults to /events
  const extractedPath = returnPaths.pop() ?? defaultReturnPath;
  // there is no support to delete all but extracted item from same parameter list. This is a workaround to it:
  // 1) delete all first
  searchParams.delete(SEARCH_PARAMS.RETURN_PATH);
  // 2) then append all except latest
  returnPaths.forEach((returnPath) =>
    searchParams.append(SEARCH_PARAMS.RETURN_PATH, returnPath)
  );
  return {
    returnPath: extractedPath,
    remainingQueryString: searchParams.toString(),
  };
};

export default extractLatestReturnPath;
