import { getEnvValue } from '../common/utils/envUtils';

const generateAtId = (id: string, endpoint: string): string =>
  `${getEnvValue('REACT_APP_LINKED_EVENTS_URL')}/${endpoint}/${id}/`;

export default generateAtId;
